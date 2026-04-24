using DroneMarketplace.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarketplace.Infrastructure.Persistence.Repositories
{
    public sealed class BookingRepository : IBookingRepository
    {
        private readonly ApplicationDbContext _context;

        public BookingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Booking?> GetByIdWithAccessGraphAsync(Guid bookingId, CancellationToken cancellationToken = default)
        {
            return await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(l => l.Pilot)
                        .ThenInclude(p => p.AppUser)
                .Include(b => b.Customer)
                .Include(b => b.Review)
                .FirstOrDefaultAsync(b => b.Id == bookingId, cancellationToken);
        }

        public async Task<IReadOnlyList<Booking>> GetByCustomerIdAsync(string customerId, CancellationToken cancellationToken = default)
        {
            return await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(l => l.Pilot)
                        .ThenInclude(p => p.AppUser)
                .Include(b => b.Customer)
                .Include(b => b.Review)
                .Where(b => b.CustomerId == customerId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Booking>> GetByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(l => l.Pilot)
                        .ThenInclude(p => p.AppUser)
                .Include(b => b.Customer)
                .Include(b => b.Review)
                .Where(b => b.Listing.Pilot.AppUserId == pilotUserId)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default)
        {
            return await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(l => l.Pilot)
                        .ThenInclude(p => p.AppUser)
                .Include(b => b.Customer)
                .Include(b => b.Review)
                .Where(b => b.StartDate >= startDate && b.EndDate <= endDate)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync(cancellationToken);
        }

        public void Add(Booking booking)
        {
            _context.Bookings.Add(booking);
        }
    }
}
