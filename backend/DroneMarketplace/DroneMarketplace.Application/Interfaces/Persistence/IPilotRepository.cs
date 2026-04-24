using DroneMarketplace.Domain.Entities;
using NetTopologySuite.Geometries;

namespace DroneMarketplace.Application.Interfaces.Persistence
{
    public interface IPilotRepository
    {
        Task<Pilot?> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default);
        Task<Pilot?> GetByIdAsync(Guid pilotId, CancellationToken cancellationToken = default);
        Task<Pilot?> GetByIdWithUserAsync(Guid pilotId, CancellationToken cancellationToken = default);
        Task<Pilot?> GetByUserIdWithUserAsync(string userId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Pilot>> SearchAsync(Point? center, double? radiusMeters, CancellationToken cancellationToken = default);
        void Add(Pilot pilot);
    }
}
