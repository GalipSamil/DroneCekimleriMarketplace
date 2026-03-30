using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Services
{
    public class BookingService : IBookingService
    {
        private readonly IApplicationDbContext _context;

        public BookingService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateBookingAsync(string customerId, CreateBookingDto bookingDto)
        {
            var listing = await _context.Listings
                .FirstOrDefaultAsync(s => s.Id == bookingDto.ListingId);

            if (listing == null)
                throw new KeyNotFoundException($"Listing with ID {bookingDto.ListingId} not found.");

            // Domain handles calculation and validation natively
            var booking = Booking.Create(
                listingId: bookingDto.ListingId,
                listing: listing,
                customerId: customerId,
                startDate: bookingDto.StartDate,
                endDate: bookingDto.EndDate,
                type: bookingDto.Type,
                location: bookingDto.Location ?? "",
                latitude: bookingDto.Latitude,
                longitude: bookingDto.Longitude,
                hours: bookingDto.Hours,
                days: bookingDto.Days,
                customerNotes: bookingDto.CustomerNotes
            );

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            return booking.Id;
        }

        public async Task<BookingDto> GetBookingAsync(Guid bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(s => s.Pilot)
                        .ThenInclude(p => p.AppUser)
                .Include(b => b.Customer)
                .Include(b => b.Review)
                .FirstOrDefaultAsync(b => b.Id == bookingId);

            if (booking == null)
                throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");

            return MapToDto(booking);
        }

        public async Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(string customerId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(s => s.Pilot)
                .Include(b => b.Review)
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            return bookings.Select(MapToDto);
        }

        public async Task<IEnumerable<BookingDto>> GetPilotBookingsAsync(string pilotUserId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Listing)
                .Include(b => b.Customer)
                .Include(b => b.Review)
                .Where(b => b.Listing.Pilot.AppUserId == pilotUserId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            return bookings.Select(MapToDto);
        }

        public async Task<bool> UpdateBookingStatusAsync(Guid bookingId, BookingStatus status, string? notes = null)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;

            // Direct mapping logic replaced by strict Domain behavior
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
                    booking.CancelByCustomer(notes ?? "Kullanıcı tarafından iptal edildi.");
                    break;
                default:
                    booking.ForceStatusChange(status, notes);
                    break;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelBookingAsync(Guid bookingId, string reason)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;
            
            booking.CancelByCustomer(reason);
            await _context.SaveChangesAsync();
            
            return true;
        }

        public async Task<decimal> CalculateBookingPriceAsync(Guid listingId, BookingType type, DateTime startDate, DateTime endDate)
        {
            var listing = await _context.Listings.FindAsync(listingId);
            if (listing == null) throw new KeyNotFoundException("Listing not found");

            // Ideally this sits in a PricingDomainService, but we duplicate pure logic here for preview endpoint efficiency.
            var mockedHours = (decimal)(endDate - startDate).TotalHours;
            var days = (int)Math.Ceiling((endDate - startDate).TotalDays);

            switch (type)
            {
                case BookingType.Hourly:
                    return listing.HourlyRate * mockedHours;
                case BookingType.Daily:
                    return listing.DailyRate * (days <= 0 ? 1 : days);
                case BookingType.Project:
                    return listing.ProjectRate;
                default:
                    return 0;
            }
        }

        public async Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
             var bookings = await _context.Bookings
                .Include(b => b.Listing)
                .Where(b => b.StartDate >= startDate && b.EndDate <= endDate)
                .ToListAsync();

            return bookings.Select(MapToDto);
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
                StartDate = booking.StartDate,
                EndDate = booking.EndDate,
                Type = booking.Type,
                Location = booking.Location,
                Latitude = booking.Latitude,
                Longitude = booking.Longitude,
                TotalPrice = booking.TotalPrice,
                Hours = booking.Hours,
                Days = booking.Days,
                Status = booking.Status,
                BookingDate = booking.BookingDate,
                CustomerNotes = booking.CustomerNotes,
                PilotNotes = booking.PilotNotes,
                HasReview = booking.Review != null
            };
        }
    }
}
