using DroneMarket.Application.Common.Security;
using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using NetTopologySuite.Geometries;

namespace DroneMarket.Application.Services
{
    public class PilotService : IPilotService
    {
        private readonly IPilotRepository _pilotRepository;
        private readonly IUnitOfWork _unitOfWork;

        public PilotService(IPilotRepository pilotRepository, IUnitOfWork unitOfWork)
        {
            _pilotRepository = pilotRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<PilotManagedProfileDto> CreateOrUpdateProfileAsync(ActorContext actor, string userId, UpdatePilotProfileDto profileDto)
        {
            PilotAccessGuard.EnsureCanUpsertOwnProfile(userId, actor);

            var pilot = await _pilotRepository.GetByUserIdWithUserAsync(userId);
            var location = ToLocation(profileDto.Latitude, profileDto.Longitude);

            if (pilot == null)
            {
                pilot = Pilot.Create(userId);
                pilot.UpdateProfile(profileDto.Bio, profileDto.EquipmentList, profileDto.SHGMLicenseNumber, location);
                _pilotRepository.Add(pilot);
            }
            else
            {
                pilot.UpdateProfile(profileDto.Bio, profileDto.EquipmentList, profileDto.SHGMLicenseNumber, location);
            }

            await _unitOfWork.SaveChangesAsync();

            pilot = await _pilotRepository.GetByUserIdWithUserAsync(userId)
                ?? throw new InvalidOperationException("Güncellenen pilot profili yüklenemedi.");

            return MapManagedProfile(pilot);
        }

        public async Task<PilotPublicProfileDto?> GetPublicProfileAsync(string userId)
        {
            var pilot = await _pilotRepository.GetByUserIdWithUserAsync(userId);
            return pilot == null ? null : MapPublicProfile(pilot);
        }

        public async Task<PilotManagedProfileDto?> GetManagedProfileAsync(ActorContext actor, string userId)
        {
            var pilot = await _pilotRepository.GetByUserIdWithUserAsync(userId);
            if (pilot == null)
            {
                return null;
            }

            PilotAccessGuard.EnsureCanReadManagedProfile(pilot, actor);
            return MapManagedProfile(pilot);
        }

        public async Task<IEnumerable<PilotPublicProfileDto>> SearchPilotsAsync(double? latitude, double? longitude, double? radiusKm)
        {
            Point? location = null;
            double? radiusMeters = null;

            if (latitude.HasValue && longitude.HasValue)
            {
                location = new Point(longitude.Value, latitude.Value) { SRID = 4326 };
                radiusMeters = (radiusKm ?? 50) * 1000;
            }

            var pilots = await _pilotRepository.SearchAsync(location, radiusMeters);
            return pilots.Select(MapPublicProfile);
        }

        public async Task VerifyPilotAsync(Guid pilotId)
        {
            var pilot = await _pilotRepository.GetByIdAsync(pilotId);
            if (pilot == null)
            {
                throw new KeyNotFoundException($"Pilot bulunamadı: {pilotId}");
            }

            pilot.Verify();
            await _unitOfWork.SaveChangesAsync();
        }

        public async Task RevokeVerificationAsync(Guid pilotId, string reason)
        {
            var pilot = await _pilotRepository.GetByIdAsync(pilotId);
            if (pilot == null)
            {
                throw new KeyNotFoundException($"Pilot bulunamadı: {pilotId}");
            }

            pilot.RevokeVerification(reason);
            await _unitOfWork.SaveChangesAsync();
        }

        private static Point? ToLocation(double latitude, double longitude)
        {
            if (latitude == 0 && longitude == 0)
            {
                return null;
            }

            return new Point(longitude, latitude) { SRID = 4326 };
        }

        private static PilotPublicProfileDto MapPublicProfile(Pilot pilot)
        {
            return new PilotPublicProfileDto
            {
                Id = pilot.Id,
                UserId = pilot.AppUserId,
                FullName = pilot.AppUser?.FullName ?? string.Empty,
                Bio = pilot.Bio,
                EquipmentList = pilot.EquipmentList,
                IsVerified = pilot.IsVerified,
                Latitude = pilot.Location?.Y ?? 0,
                Longitude = pilot.Location?.X ?? 0
            };
        }

        private static PilotManagedProfileDto MapManagedProfile(Pilot pilot)
        {
            return new PilotManagedProfileDto
            {
                Id = pilot.Id,
                UserId = pilot.AppUserId,
                FullName = pilot.AppUser?.FullName ?? string.Empty,
                Bio = pilot.Bio,
                EquipmentList = pilot.EquipmentList,
                SHGMLicenseNumber = pilot.SHGMLicenseNumber,
                IsVerified = pilot.IsVerified,
                Latitude = pilot.Location?.Y ?? 0,
                Longitude = pilot.Location?.X ?? 0
            };
        }
    }
}
