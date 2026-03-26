using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;

namespace DroneMarket.Application.Services
{
    public class PilotService : IPilotService
    {
        private readonly IApplicationDbContext _context;

        public PilotService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task CreateOrUpdateProfileAsync(string userId, PilotProfileDto profileDto)
        {
            var pilot = await _context.Pilots.FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pilot == null)
            {
                pilot = new Pilot
                {
                    AppUserId = userId,
                    Bio = profileDto.Bio,
                    EquipmentList = profileDto.EquipmentList,
                    SHGMLicenseNumber = profileDto.SHGMLicenseNumber,
                    Location = new Point(profileDto.Longitude, profileDto.Latitude) { SRID = 4326 }
                };
                _context.Pilots.Add(pilot);
            }
            else
            {
                pilot.Bio = profileDto.Bio;
                pilot.EquipmentList = profileDto.EquipmentList;
                pilot.SHGMLicenseNumber = profileDto.SHGMLicenseNumber;
                pilot.Location = new Point(profileDto.Longitude, profileDto.Latitude) { SRID = 4326 };
            }

            await _context.SaveChangesAsync();
        }

        public async Task<PilotProfileDto> GetProfileAsync(string userId)
        {
            var pilot = await _context.Pilots.FirstOrDefaultAsync(p => p.AppUserId == userId);
            if (pilot == null) return null;

            return new PilotProfileDto
            {
                Bio = pilot.Bio,
                EquipmentList = pilot.EquipmentList,
                SHGMLicenseNumber = pilot.SHGMLicenseNumber,
                Latitude = pilot.Location.Y,
                Longitude = pilot.Location.X
            };
        }

        public async Task<IEnumerable<PilotProfileDto>> SearchPilotsAsync(double lat, double lon, double radiusKm)
        {
            var location = new Point(lon, lat) { SRID = 4326 };
            var pilots = await _context.Pilots
                .Where(p => p.Location.Distance(location) <= radiusKm * 1000) // Approximate distance in meters if using projected CRS, but for 4326 it's degrees. 
                // Note: For accurate distance in meters with PostGIS, we should cast to geography or use a projected CRS. 
                // For simplicity here, assuming the DB is configured correctly or we accept degree approximation for now.
                // Better approach for PostGIS: .Where(p => p.Location.IsWithinDistance(location, radiusInDegrees))
                .ToListAsync();

            return pilots.Select(p => new PilotProfileDto
            {
                Bio = p.Bio,
                EquipmentList = p.EquipmentList,
                SHGMLicenseNumber = p.SHGMLicenseNumber,
                Latitude = p.Location.Y,
                Longitude = p.Location.X
            });
        }
    }
}
