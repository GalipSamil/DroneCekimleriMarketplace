using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Common.Time;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Application.Common.Security;
using DroneMarketplace.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace DroneMarketplace.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IListingRepository _listingRepository;
        private readonly IApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public BookingService(
            IBookingRepository bookingRepository,
            IListingRepository listingRepository,
            IApplicationDbContext context,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _bookingRepository = bookingRepository;
            _listingRepository = listingRepository;
            _context = context;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> CreateBookingAsync(CreateBookingDto bookingDto)
        {
            var actor = _currentUserService.GetRequiredActor();
            if (!actor.IsCustomer)
                throw new ForbiddenAccessException("Sadece müşteri rolündeki kullanıcılar rezervasyon oluşturabilir.");

            var customerExists = await _context.Users.AnyAsync(user => user.Id == actor.UserId);
            if (!customerExists)
                throw new UnauthorizedAccessException("Oturumunuz artık geçerli değil. Lütfen tekrar giriş yapın.");

            var listing = await _listingRepository.GetByIdAsync(bookingDto.ListingId);

            if (listing == null)
                throw new KeyNotFoundException($"Listing with ID {bookingDto.ListingId} not found.");

            if (!listing.IsActive)
                throw new InvalidOperationException("Pasif ilanlar için rezervasyon oluşturulamaz.");

            var normalizedHours = bookingDto.Type == BookingType.Hourly
                ? bookingDto.Hours
                : 0;

            var normalizedDays = bookingDto.Type == BookingType.Daily
                ? bookingDto.Days
                : 0;

            var normalizedStartDate = MarketplaceDateTime.NormalizeIncoming(bookingDto.StartDate);
            var normalizedEndDate = MarketplaceDateTime.NormalizeIncoming(bookingDto.EndDate);

            // Domain handles calculation and validation natively
            var booking = Booking.Create(
                listingId: bookingDto.ListingId,
                listing: listing,
                customerId: actor.UserId,
                startDate: normalizedStartDate,
                endDate: normalizedEndDate,
                type: bookingDto.Type,
                location: bookingDto.Location ?? "",
                latitude: bookingDto.Latitude,
                longitude: bookingDto.Longitude,
                hours: normalizedHours,
                days: normalizedDays,
                customerNotes: bookingDto.CustomerNotes
            );

            _bookingRepository.Add(booking);
            await _unitOfWork.SaveChangesAsync();

            return booking.Id;
        }

        public async Task<BookingDto> GetBookingAsync(Guid bookingId)
        {
            var booking = await _bookingRepository.GetByIdWithAccessGraphAsync(bookingId);

            if (booking == null)
                throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");

            BookingAccessGuard.EnsureCanRead(booking, _currentUserService.GetRequiredActor());
            return MapToDto(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(string customerId)
        {
            var actor = _currentUserService.GetRequiredActor();
            BookingAccessGuard.EnsureCustomerOrAdmin(customerId, actor);

            var bookings = await _bookingRepository.GetByCustomerIdAsync(customerId);
            return bookings.Select(MapToDto);
        }

        public async Task<IEnumerable<BookingDto>> GetMyBookingsAsync()
        {
            var actor = _currentUserService.GetRequiredActor();
            var bookings = await _bookingRepository.GetByCustomerIdAsync(actor.UserId);
            return bookings.Select(MapToDto);
        }

        public async Task<IEnumerable<BookingDto>> GetPilotBookingsAsync(string pilotUserId)
        {
            var actor = _currentUserService.GetRequiredActor();
            BookingAccessGuard.EnsurePilotOrAdmin(pilotUserId, actor);

            var bookings = await _bookingRepository.GetByPilotUserIdAsync(pilotUserId);
            return bookings.Select(MapToDto);
        }

        public async Task<bool> UpdateBookingStatusAsync(Guid bookingId, BookingStatus status, string? notes = null)
        {
            var booking = await _bookingRepository.GetByIdWithAccessGraphAsync(bookingId);
            if (booking == null) return false;

            var actor = _currentUserService.GetRequiredActor();
            ApplyStatusChange(booking, actor, status, notes);

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelBookingAsync(Guid bookingId, string reason)
        {
            var booking = await _bookingRepository.GetByIdWithAccessGraphAsync(bookingId);
            if (booking == null) return false;

            var actor = _currentUserService.GetRequiredActor();
            if (!actor.IsAdmin && booking.CustomerId != actor.UserId)
                throw new ForbiddenAccessException("Yalnızca rezervasyonu oluşturan müşteri veya admin iptal işlemi yapabilir.");

            booking.CancelByCustomer(reason);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var bookings = await _bookingRepository.GetByDateRangeAsync(
                MarketplaceDateTime.NormalizeIncoming(startDate),
                MarketplaceDateTime.NormalizeIncoming(endDate));
            return bookings.Select(MapToDto);
        }

        private static void ApplyStatusChange(Booking booking, ActorContext actor, BookingStatus status, string? notes)
        {
            if (actor.IsAdmin)
            {
                ApplyAdminStatusChange(booking, status, notes);
                return;
            }

            if (booking.Listing?.Pilot?.AppUserId == actor.UserId)
            {
                ApplyPilotStatusChange(booking, status, notes);
                return;
            }

            if (booking.CustomerId == actor.UserId)
            {
                ApplyCustomerStatusChange(booking, status, notes);
                return;
            }

            throw new ForbiddenAccessException("Bu rezervasyon durumu üzerinde işlem yetkiniz yok.");
        }

        private static void ApplyPilotStatusChange(Booking booking, BookingStatus status, string? notes)
        {
            switch (status)
            {
                case BookingStatus.Accepted:
                    booking.Accept(notes);
                    break;
                case BookingStatus.Rejected:
                    booking.Reject(notes ?? "Pilot tarafından reddedildi.");
                    break;
                case BookingStatus.InProgress:
                    booking.Start(notes);
                    break;
                case BookingStatus.Delivered:
                    booking.Deliver(notes);
                    break;
                default:
                    throw new ForbiddenAccessException("Pilot bu durum değişikliğini yapamaz.");
            }
        }

        private static void ApplyCustomerStatusChange(Booking booking, BookingStatus status, string? notes)
        {
            switch (status)
            {
                case BookingStatus.InProgress when booking.Status == BookingStatus.Delivered:
                    booking.RequestRevision(notes ?? "Müşteri revizyon talep etti.");
                    break;
                case BookingStatus.Completed:
                    booking.Complete();
                    break;
                case BookingStatus.Cancelled:
                    booking.CancelByCustomer(notes ?? "Müşteri tarafından iptal edildi.");
                    break;
                default:
                    throw new ForbiddenAccessException("Müşteri bu durum değişikliğini yapamaz.");
            }
        }

        private static void ApplyAdminStatusChange(Booking booking, BookingStatus status, string? notes)
        {
            switch (status)
            {
                case BookingStatus.Accepted:
                    booking.Accept(notes);
                    break;
                case BookingStatus.Rejected:
                    booking.Reject(notes ?? "Sistem tarafından reddedildi.");
                    break;
                case BookingStatus.InProgress:
                    if (booking.Status == BookingStatus.Delivered)
                        booking.RequestRevision(notes ?? "Düzeltme gerekli.");
                    else
                        booking.Start(notes);
                    break;
                case BookingStatus.Delivered:
                    booking.Deliver(notes);
                    break;
                case BookingStatus.Completed:
                    booking.Complete();
                    break;
                case BookingStatus.Cancelled:
                    booking.CancelByCustomer(notes ?? "Admin tarafından iptal edildi.");
                    break;
                default:
                    booking.ForceStatusChange(status, notes);
                    break;
            }
        }

        private static BookingDto MapToDto(Booking booking)
        {
            return new BookingDto
            {
                Id = booking.Id,
                ListingId = booking.ListingId,
                Title = booking.Listing?.Title ?? "Unknown Service",
                CustomerId = booking.CustomerId,
                CustomerName = booking.Customer != null ? $"{booking.Customer.FirstName} {booking.Customer.LastName}" : "Unknown Customer",
                PilotName = booking.Listing?.Pilot?.AppUser != null ? $"{booking.Listing.Pilot.AppUser.FirstName} {booking.Listing.Pilot.AppUser.LastName}" : "Unknown Pilot",
                StartDate = MarketplaceDateTime.NormalizeOutgoing(booking.StartDate),
                EndDate = MarketplaceDateTime.NormalizeOutgoing(booking.EndDate),
                Type = booking.Type,
                Location = booking.Location,
                Latitude = booking.Latitude,
                Longitude = booking.Longitude,
                TotalPrice = booking.TotalPrice,
                Hours = booking.Hours,
                Days = booking.Days,
                Status = booking.Status,
                BookingDate = MarketplaceDateTime.NormalizeOutgoing(booking.BookingDate),
                CustomerNotes = booking.CustomerNotes,
                PilotNotes = booking.PilotNotes,
                HasReview = booking.Review != null
            };
        }
    }
}
