using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarket.Application.Services
{
    public class DroneManagementService : IDroneManagementService
    {
        private readonly IDroneRepository _droneRepository;
        private readonly IPilotRepository _pilotRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IUnitOfWork _unitOfWork;

        public DroneManagementService(
            IDroneRepository droneRepository,
            IPilotRepository pilotRepository,
            ICurrentUserService currentUserService,
            IUnitOfWork unitOfWork)
        {
            _droneRepository = droneRepository;
            _pilotRepository = pilotRepository;
            _currentUserService = currentUserService;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> AddDroneAsync(CreateDroneDto droneDto)
        {
            var actor = _currentUserService.GetRequiredActor();
            if (!actor.IsPilot)
                throw new ForbiddenAccessException("Drone ekleme işlemi yalnızca pilotlar için yetkilidir.");

            var pilot = await _pilotRepository.GetByUserIdAsync(actor.UserId);

            if (pilot == null)
            {
                throw new KeyNotFoundException("Pilot profile not found for this user.");
            }

            var drone = Drone.Create(
                pilot.Id,
                droneDto.Model,
                droneDto.Brand,
                droneDto.Type,
                droneDto.Specifications,
                droneDto.Weight,
                droneDto.MaxFlightTime,
                droneDto.ImageUrl);

            _droneRepository.Add(drone);
            await _unitOfWork.SaveChangesAsync();

            return drone.Id;
        }

        public async Task<DroneDto> GetDroneAsync(Guid droneId)
        {
            var drone = await _droneRepository.GetByIdAsync(droneId);

            if (drone == null)
            {
                throw new KeyNotFoundException($"Drone with ID {droneId} not found.");
            }

            return MapToDto(drone);
        }

        public async Task<IEnumerable<DroneDto>> GetPilotDronesAsync(string pilotUserId)
        {
            var drones = await _droneRepository.GetByPilotUserIdAsync(pilotUserId);
            return drones.Select(MapToDto);
        }

        public async Task<bool> UpdateDroneAsync(Guid droneId, UpdateDroneDto droneDto)
        {
            var drone = await _droneRepository.GetByIdWithPilotAsync(droneId);
            if (drone == null) return false;

            EnsureCanManageDrone(drone);
            drone.UpdateDetails(
                droneDto.Model,
                droneDto.Brand,
                droneDto.Type,
                droneDto.Specifications,
                droneDto.Weight,
                droneDto.MaxFlightTime,
                droneDto.ImageUrl);
            drone.SetAvailability(droneDto.IsAvailable);

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDroneAsync(Guid droneId)
        {
            var drone = await _droneRepository.GetByIdWithPilotAsync(droneId);
            if (drone == null) return false;

            EnsureCanManageDrone(drone);
            _droneRepository.Remove(drone);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetDroneAvailabilityAsync(Guid droneId, bool isAvailable)
        {
            var drone = await _droneRepository.GetByIdWithPilotAsync(droneId);
            if (drone == null) return false;

            EnsureCanManageDrone(drone);
            drone.SetAvailability(isAvailable);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<DroneDto>> GetAvailableDronesAsync(DroneType? type = null)
        {
            var drones = await _droneRepository.GetAvailableAsync(type);
            return drones.Select(MapToDto);
        }

        private void EnsureCanManageDrone(Drone drone)
        {
            var actor = _currentUserService.GetRequiredActor();
            if (actor.IsAdmin)
            {
                return;
            }

            if (drone.Pilot?.AppUserId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu drone üzerinde işlem yapma yetkiniz yok.");
        }

        private static DroneDto MapToDto(Drone drone)
        {
            return new DroneDto
            {
                Id = drone.Id,
                PilotId = drone.PilotId,
                PilotName = drone.Pilot?.AppUser != null ? drone.Pilot.AppUser.FullName : "Unknown Pilot",
                Model = drone.Model,
                Brand = drone.Brand,
                Type = drone.Type,
                Specifications = drone.Specifications,
                IsAvailable = drone.IsAvailable,
                Weight = drone.Weight,
                MaxFlightTime = drone.MaxFlightTime,
                ImageUrl = drone.ImageUrl,
                CreatedAt = drone.CreatedAt
            };
        }
    }
}
