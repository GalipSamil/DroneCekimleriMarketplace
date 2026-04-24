using DroneMarketplace.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarketplace.Infrastructure.Persistence.Repositories
{
    public sealed class DroneRepository : IDroneRepository
    {
        private readonly ApplicationDbContext _context;

        public DroneRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Drone?> GetByIdAsync(Guid droneId, CancellationToken cancellationToken = default)
        {
            return await _context.Drones
                .Include(d => d.Pilot)
                    .ThenInclude(p => p.AppUser)
                .FirstOrDefaultAsync(d => d.Id == droneId, cancellationToken);
        }

        public async Task<Drone?> GetByIdWithPilotAsync(Guid droneId, CancellationToken cancellationToken = default)
        {
            return await _context.Drones
                .Include(d => d.Pilot)
                    .ThenInclude(p => p.AppUser)
                .FirstOrDefaultAsync(d => d.Id == droneId, cancellationToken);
        }

        public async Task<IReadOnlyList<Drone>> GetByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Drones
                .Include(d => d.Pilot)
                    .ThenInclude(p => p.AppUser)
                .Where(d => d.Pilot.AppUserId == pilotUserId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Drone>> GetAvailableAsync(DroneType? type = null, CancellationToken cancellationToken = default)
        {
            var query = _context.Drones
                .Include(d => d.Pilot)
                    .ThenInclude(p => p.AppUser)
                .Where(d => d.IsAvailable);

            if (type.HasValue)
            {
                query = query.Where(d => d.Type == type.Value);
            }

            return await query
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync(cancellationToken);
        }

        public void Add(Drone drone)
        {
            _context.Drones.Add(drone);
        }

        public void Remove(Drone drone)
        {
            _context.Drones.Remove(drone);
        }
    }
}
