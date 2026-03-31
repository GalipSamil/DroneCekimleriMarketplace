using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace DroneMarket.Infrastructure.Persistence.Repositories
{
    public sealed class PilotRepository : IPilotRepository
    {
        private readonly ApplicationDbContext _context;

        public PilotRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Pilot?> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.Pilots
                .Include(p => p.AppUser)
                .FirstOrDefaultAsync(p => p.AppUserId == userId, cancellationToken);
        }

        public async Task<Pilot?> GetByIdAsync(Guid pilotId, CancellationToken cancellationToken = default)
        {
            return await _context.Pilots
                .FirstOrDefaultAsync(p => p.Id == pilotId, cancellationToken);
        }

        public async Task<Pilot?> GetByIdWithUserAsync(Guid pilotId, CancellationToken cancellationToken = default)
        {
            return await _context.Pilots
                .Include(p => p.AppUser)
                .FirstOrDefaultAsync(p => p.Id == pilotId, cancellationToken);
        }

        public async Task<Pilot?> GetByUserIdWithUserAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.Pilots
                .Include(p => p.AppUser)
                .FirstOrDefaultAsync(p => p.AppUserId == userId, cancellationToken);
        }

        public async Task<IReadOnlyList<Pilot>> SearchAsync(Point? center, double? radiusMeters, CancellationToken cancellationToken = default)
        {
            var query = _context.Pilots
                .Include(p => p.AppUser)
                .AsQueryable();

            if (center != null && radiusMeters.HasValue)
            {
                query = query.Where(p => p.Location != null && p.Location.Distance(center) <= radiusMeters.Value);
            }

            return await query
                .OrderBy(p => p.AppUser!.FullName)
                .ToListAsync(cancellationToken);
        }

        public void Add(Pilot pilot)
        {
            _context.Pilots.Add(pilot);
        }
    }
}
