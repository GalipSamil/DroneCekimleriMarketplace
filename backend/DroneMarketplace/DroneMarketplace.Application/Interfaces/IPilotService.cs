using DroneMarketplace.Application.Common.Security;
using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IPilotService
    {
        Task<PilotManagedProfileDto> CreateOrUpdateProfileAsync(ActorContext actor, string userId, UpdatePilotProfileDto profileDto);
        Task<PilotPublicProfileDto?> GetPublicProfileAsync(string userId);
        Task<PilotManagedProfileDto?> GetManagedProfileAsync(ActorContext actor, string userId);
        Task<IEnumerable<PilotPublicProfileDto>> SearchPilotsAsync(double? latitude, double? longitude, double? radiusKm);
        Task VerifyPilotAsync(Guid pilotId);
        Task RevokeVerificationAsync(Guid pilotId, string reason);
    }
}
