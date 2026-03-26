using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Interfaces
{
    public interface IPilotService
    {
        Task CreateOrUpdateProfileAsync(string userId, PilotProfileDto profileDto);
        Task<PilotProfileDto> GetProfileAsync(string userId);
        Task<IEnumerable<PilotProfileDto>> SearchPilotsAsync(double lat, double lon, double radiusKm);
    }
}
