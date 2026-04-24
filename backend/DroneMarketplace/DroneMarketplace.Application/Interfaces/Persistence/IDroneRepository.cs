using DroneMarketplace.Domain.Entities;

namespace DroneMarketplace.Application.Interfaces.Persistence
{
    public interface IDroneRepository
    {
        Task<Drone?> GetByIdAsync(Guid droneId, CancellationToken cancellationToken = default);
        Task<Drone?> GetByIdWithPilotAsync(Guid droneId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Drone>> GetByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Drone>> GetAvailableAsync(DroneType? type = null, CancellationToken cancellationToken = default);
        void Add(Drone drone);
        void Remove(Drone drone);
    }
}
