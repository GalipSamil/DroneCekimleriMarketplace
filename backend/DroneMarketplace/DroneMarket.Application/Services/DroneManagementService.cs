using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Services
{
    public class DroneManagementService : IDroneManagementService
    {
        private readonly IApplicationDbContext _context;

        public DroneManagementService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> AddDroneAsync(string pilotUserId, CreateDroneDto droneDto)
        {
            var pilot = await _context.Pilots
                .FirstOrDefaultAsync(p => p.AppUserId == pilotUserId);

            if (pilot == null)
            {
                throw new KeyNotFoundException("Pilot profile not found for this user.");
            }

            var drone = new Drone
            {
                Id = Guid.NewGuid(),
                PilotId = pilot.Id,
                Model = droneDto.Model,
                Brand = droneDto.Brand,
                Type = droneDto.Type,
                Specifications = droneDto.Specifications,
                IsAvailable = true,
                Weight = droneDto.Weight,
                MaxFlightTime = droneDto.MaxFlightTime,
                ImageUrl = droneDto.ImageUrl,
                CreatedAt = DateTime.UtcNow
            };

            _context.Drones.Add(drone);
            await _context.SaveChangesAsync();

            return drone.Id;
        }

        public async Task<DroneDto> GetDroneAsync(Guid droneId)
        {
            var drone = await _context.Drones
                .Include(d => d.Pilot)
                .ThenInclude(p => p.AppUser) // Assuming we want pilot name
                .FirstOrDefaultAsync(d => d.Id == droneId);

            if (drone == null)
            {
                throw new KeyNotFoundException($"Drone with ID {droneId} not found.");
            }

            return MapToDto(drone);
        }

        public async Task<IEnumerable<DroneDto>> GetPilotDronesAsync(string pilotUserId)
        {
            var drones = await _context.Drones
                .Include(d => d.Pilot)
                .ThenInclude(p => p.AppUser)
                .Where(d => d.Pilot.AppUserId == pilotUserId)
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();

            return drones.Select(MapToDto);
        }

        public async Task<bool> UpdateDroneAsync(Guid droneId, UpdateDroneDto droneDto)
        {
            var drone = await _context.Drones.FindAsync(droneId);
            if (drone == null) return false;

            drone.Model = droneDto.Model;
            drone.Brand = droneDto.Brand;
            drone.Type = droneDto.Type;
            drone.Specifications = droneDto.Specifications;
            drone.IsAvailable = droneDto.IsAvailable;
            drone.Weight = droneDto.Weight;
            drone.MaxFlightTime = droneDto.MaxFlightTime;
            drone.ImageUrl = droneDto.ImageUrl;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDroneAsync(Guid droneId)
        {
            var drone = await _context.Drones.FindAsync(droneId);
            if (drone == null) return false;

            _context.Drones.Remove(drone);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetDroneAvailabilityAsync(Guid droneId, bool isAvailable)
        {
            var drone = await _context.Drones.FindAsync(droneId);
            if (drone == null) return false;

            drone.IsAvailable = isAvailable;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<DroneDto>> GetAvailableDronesAsync(DroneType? type = null)
        {
            var query = _context.Drones
                .Include(d => d.Pilot)
                .ThenInclude(p => p.AppUser)
                .Where(d => d.IsAvailable);

            if (type.HasValue)
            {
                query = query.Where(d => d.Type == type.Value);
            }

            var drones = await query.ToListAsync();
            return drones.Select(MapToDto);
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
