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

            Point? location = null;
            if (profileDto.Latitude != 0 || profileDto.Longitude != 0)
            {
                location = new Point(profileDto.Longitude, profileDto.Latitude) { SRID = 4326 };
            }

            if (pilot == null)
            {
                // Use factory method — never raw constructor
                pilot = Pilot.Create(userId);
                pilot.UpdateProfile(profileDto.Bio, profileDto.EquipmentList, profileDto.SHGMLicenseNumber, location);
                _context.Pilots.Add(pilot);
            }
            else
            {
                // Domain method does property assignment and clears verification if license is removed
                pilot.UpdateProfile(profileDto.Bio, profileDto.EquipmentList, profileDto.SHGMLicenseNumber, location);
            }

            await _context.SaveChangesAsync();
        }

        public async Task<PilotProfileDto?> GetProfileAsync(string userId)
        {
            var pilot = await _context.Pilots
                .Include(p => p.AppUser)
                .FirstOrDefaultAsync(p => p.AppUserId == userId);

            if (pilot == null) return null;

            return new PilotProfileDto
            {
                Bio = pilot.Bio,
                EquipmentList = pilot.EquipmentList,
                SHGMLicenseNumber = pilot.SHGMLicenseNumber,
                IsVerified = pilot.IsVerified,
                Latitude = pilot.Location?.Y ?? 0,
                Longitude = pilot.Location?.X ?? 0
            };
        }

        public async Task<IEnumerable<PilotProfileDto>> SearchPilotsAsync(double lat, double lon, double radiusKm)
        {
            var location = new Point(lon, lat) { SRID = 4326 };

            var pilots = await _context.Pilots
                .Include(p => p.AppUser)
                .Where(p => p.Location != null && p.Location.Distance(location) <= radiusKm * 1000)
                .ToListAsync();

            return pilots.Select(p => new PilotProfileDto
            {
                Bio = p.Bio,
                EquipmentList = p.EquipmentList,
                SHGMLicenseNumber = p.SHGMLicenseNumber,
                IsVerified = p.IsVerified,
                Latitude = p.Location?.Y ?? 0,
                Longitude = p.Location?.X ?? 0
            });
        }

        /// <summary>
        /// Admin-only: verifies a pilot. Domain enforces SHGM license presence.
        /// GlobalExceptionMiddleware handles InvalidOperationException if license is missing.
        /// </summary>
        public async Task VerifyPilotAsync(Guid pilotId)
        {
            var pilot = await _context.Pilots.FindAsync(pilotId);
            if (pilot == null)
                throw new KeyNotFoundException($"Pilot bulunamadı: {pilotId}");

            pilot.Verify(); // Domain enforces: license must be present
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Admin-only: revokes a pilot's verification.
        /// </summary>
        public async Task RevokeVerificationAsync(Guid pilotId, string reason)
        {
            var pilot = await _context.Pilots.FindAsync(pilotId);
            if (pilot == null)
                throw new KeyNotFoundException($"Pilot bulunamadı: {pilotId}");

            pilot.RevokeVerification(reason);
            await _context.SaveChangesAsync();
        }
    }
}
