using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Infrastructure.Persistence.Repositories
{
    public sealed class ListingRepository : IListingRepository
    {
        private readonly ApplicationDbContext _context;

        public ListingRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Listing?> GetByIdAsync(Guid listingId, CancellationToken cancellationToken = default)
        {
            return await _context.Listings
                .Include(l => l.Pilot)
                    .ThenInclude(p => p.AppUser)
                .FirstOrDefaultAsync(l => l.Id == listingId, cancellationToken);
        }

        public async Task<IReadOnlyList<Listing>> SearchActiveAsync(string query, ServiceCategory? category = null, CancellationToken cancellationToken = default)
        {
            var listingsQuery = _context.Listings
                .Include(l => l.Pilot)
                    .ThenInclude(p => p.AppUser)
                .Where(l => l.IsActive);

            if (!string.IsNullOrWhiteSpace(query))
            {
                listingsQuery = listingsQuery.Where(l =>
                    l.Title.Contains(query) ||
                    l.Description.Contains(query));
            }

            if (category.HasValue)
            {
                listingsQuery = listingsQuery.Where(l => l.Category == category.Value);
            }

            return await listingsQuery
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Listing>> GetByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Listings
                .Include(l => l.Pilot)
                    .ThenInclude(p => p.AppUser)
                .Where(l => l.Pilot.AppUserId == pilotUserId)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Listing>> GetActiveByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Listings
                .Include(l => l.Pilot)
                    .ThenInclude(p => p.AppUser)
                .Where(l => l.Pilot.AppUserId == pilotUserId && l.IsActive)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Listing>> GetActiveByLocationAsync(double latitude, double longitude, double radiusKm, CancellationToken cancellationToken = default)
        {
            return await _context.Listings
                .Include(l => l.Pilot)
                    .ThenInclude(p => p.AppUser)
                .Where(l => l.IsActive)
                .OrderByDescending(l => l.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public void Add(Listing listing)
        {
            _context.Listings.Add(listing);
        }

        public void Remove(Listing listing)
        {
            _context.Listings.Remove(listing);
        }
    }
}
