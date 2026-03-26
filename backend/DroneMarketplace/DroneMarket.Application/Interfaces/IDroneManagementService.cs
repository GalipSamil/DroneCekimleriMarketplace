using DroneMarket.Application.DTOs;
using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces
{
    public interface IDroneManagementService
    {
        Task<Guid> AddDroneAsync(string pilotUserId, CreateDroneDto droneDto);
        Task<DroneDto> GetDroneAsync(Guid droneId);
        Task<IEnumerable<DroneDto>> GetPilotDronesAsync(string pilotUserId);
        Task<bool> UpdateDroneAsync(Guid droneId, UpdateDroneDto droneDto);
        Task<bool> DeleteDroneAsync(Guid droneId);
        Task<bool> SetDroneAvailabilityAsync(Guid droneId, bool isAvailable);
        Task<IEnumerable<DroneDto>> GetAvailableDronesAsync(DroneType? type = null);
    }
}