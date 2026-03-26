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
            {
                throw new KeyNotFoundException($"Listing with ID {bookingDto.ListingId} not found.");
            }

            var booking = new Booking
            {
                Id = Guid.NewGuid(),
                ListingId = bookingDto.ListingId,
                CustomerId = customerId,
                StartDate = bookingDto.StartDate,
                EndDate = bookingDto.EndDate,
                Type = bookingDto.Type,
                Location = bookingDto.Location ?? "",
                Latitude = bookingDto.Latitude,
                Longitude = bookingDto.Longitude,
                CustomerNotes = bookingDto.CustomerNotes ?? "",
                PilotNotes = "",
                Status = BookingStatus.Pending,
                BookingDate = DateTime.UtcNow,
                Hours = bookingDto.Hours,
                Days = bookingDto.Days
            };

            // Calculate price securely on server side
            var duration = bookingDto.EndDate - bookingDto.StartDate;
            
            if (bookingDto.Type == BookingType.Hourly)
            {
                booking.TotalPrice = listing.HourlyRate * bookingDto.Hours;
            }
            else if (bookingDto.Type == BookingType.Daily)
            {
                booking.TotalPrice = listing.DailyRate * bookingDto.Days;
            }
            else // Project
            {
                booking.TotalPrice = listing.ProjectRate;
            }

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
            {
                throw new KeyNotFoundException($"Booking with ID {bookingId} not found.");
            }

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
            // We need to find bookings where the listing belongs to the pilot
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

            if (!string.IsNullOrEmpty(notes))
            {
                if (status == BookingStatus.InProgress && booking.Status == BookingStatus.Delivered)
                {
                    booking.CustomerNotes = string.IsNullOrEmpty(booking.CustomerNotes) ? $"[İade Sebebi]: {notes}" : booking.CustomerNotes + $"\n[İade Sebebi]: {notes}";
                }
                else
                {
                    booking.PilotNotes = string.IsNullOrEmpty(booking.PilotNotes) ? $"[Pilot Mesajı]: {notes}" : booking.PilotNotes + $"\n[Pilot Mesajı]: {notes}";
                }
            }

            booking.Status = status;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelBookingAsync(Guid bookingId, string reason)
        {
            var booking = await _context.Bookings.FindAsync(bookingId);
            if (booking == null) return false;

            if (booking.Status == BookingStatus.Completed || booking.Status == BookingStatus.Cancelled)
            {
                return false;
            }

            booking.Status = BookingStatus.Cancelled;
            booking.CustomerNotes = (booking.CustomerNotes ?? "") + $" [Cancelled: {reason}]";

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> CalculateBookingPriceAsync(Guid listingId, BookingType type, DateTime startDate, DateTime endDate)
        {
            var listing = await _context.Listings.FindAsync(listingId);
            if (listing == null) throw new KeyNotFoundException("Listing not found");

            var duration = endDate - startDate;
            
            switch (type)
            {
                case BookingType.Hourly:
                    return listing.HourlyRate * (decimal)duration.TotalHours;
                case BookingType.Daily:
                    var days = (int)Math.Ceiling(duration.TotalDays);
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
