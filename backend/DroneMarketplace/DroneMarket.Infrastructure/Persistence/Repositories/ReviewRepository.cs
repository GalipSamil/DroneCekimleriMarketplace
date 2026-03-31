using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Infrastructure.Persistence.Repositories
{
    public sealed class ReviewRepository : IReviewRepository
    {
        private readonly ApplicationDbContext _context;

        public ReviewRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Review?> GetByIdWithAccessGraphAsync(Guid reviewId, CancellationToken cancellationToken = default)
        {
            return await _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Customer)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Listing)
                        .ThenInclude(l => l.Pilot)
                            .ThenInclude(p => p.AppUser)
                .FirstOrDefaultAsync(r => r.Id == reviewId, cancellationToken);
        }

        public async Task<Review?> GetByBookingIdWithAccessGraphAsync(Guid bookingId, CancellationToken cancellationToken = default)
        {
            return await _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Customer)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Listing)
                        .ThenInclude(l => l.Pilot)
                            .ThenInclude(p => p.AppUser)
                .FirstOrDefaultAsync(r => r.BookingId == bookingId, cancellationToken);
        }

        public async Task<IReadOnlyList<Review>> GetByPilotIdAsync(Guid pilotId, CancellationToken cancellationToken = default)
        {
            return await _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Customer)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Listing)
                .Where(r => r.Booking.Listing.PilotId == pilotId && !r.Booking.Listing.IsDeleted)
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<bool> ExistsByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken = default)
        {
            return await _context.Reviews.AnyAsync(r => r.BookingId == bookingId, cancellationToken);
        }

        public void Add(Review review)
        {
            _context.Reviews.Add(review);
        }

        public void Remove(Review review)
        {
            _context.Reviews.Remove(review);
        }
    }
}
