using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Services
{
    public class ListingService : IListingService
    {
        private readonly IApplicationDbContext _context;

        public ListingService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Guid> CreateListingAsync(string userId, CreateListingDto listingDto)
        {
            var pilot = await _context.Pilots.FirstOrDefaultAsync(p => p.AppUserId == userId);
            if (pilot == null) throw new Exception($"User '{userId}' is not a pilot. Pilot count in DB: {await _context.Pilots.CountAsync()}");

            var listing = new Listing
            {
                PilotId = pilot.Id,
                Title = listingDto.Title,
                Description = listingDto.Description,
                Category = listingDto.Category,
                HourlyRate = listingDto.HourlyRate,
                DailyRate = listingDto.DailyRate,
                ProjectRate = listingDto.ProjectRate,
                CoverImageUrl = listingDto.CoverImageUrl,
                MaxDistance = listingDto.MaxDistance,
                RequiredEquipment = listingDto.RequiredEquipment,
                DeliverableFormat = listingDto.DeliverableFormat
            };

            _context.Listings.Add(listing);
            await _context.SaveChangesAsync();

            return listing.Id;
        }

        public async Task<ListingDto> GetListingAsync(Guid listingId)
        {
            var listing = await _context.Listings
                .Include(s => s.Pilot)
                .ThenInclude(p => p.AppUser)
                .FirstOrDefaultAsync(s => s.Id == listingId);

            if (listing == null) return null;

            return MapToDto(listing);
        }

        public async Task<IEnumerable<ListingDto>> SearchListingsAsync(string query, ServiceCategory? category = null)
        {
            var listingsQuery = _context.Listings
                .Include(s => s.Pilot)
                .ThenInclude(p => p.AppUser)
                .Where(s => s.IsActive);

            if (!string.IsNullOrEmpty(query))
            {
                listingsQuery = listingsQuery.Where(s => 
                    s.Title.Contains(query) || 
                    s.Description.Contains(query));
            }

            if (category.HasValue)
            {
                listingsQuery = listingsQuery.Where(s => s.Category == category.Value);
            }

            var listings = await listingsQuery.ToListAsync();
            return listings.Select(MapToDto);
        }

        public async Task<IEnumerable<ListingDto>> GetPilotListingsAsync(string userId)
        {
            var pilot = await _context.Pilots.FirstOrDefaultAsync(p => p.AppUserId == userId);
            if (pilot == null) return new List<ListingDto>();

            var listings = await _context.Listings
                .Include(s => s.Pilot)
                .ThenInclude(p => p.AppUser)
                .Where(s => s.PilotId == pilot.Id)
                .ToListAsync();

            return listings.Select(MapToDto);
        }

        public async Task<bool> UpdateListingAsync(Guid listingId, UpdateListingDto listingDto)
        {
            var listing = await _context.Listings.FindAsync(listingId);
            if (listing == null) return false;

            listing.Title = listingDto.Title;
            listing.Description = listingDto.Description;
            listing.Category = listingDto.Category;
            listing.HourlyRate = listingDto.HourlyRate;
            listing.DailyRate = listingDto.DailyRate;
            listing.ProjectRate = listingDto.ProjectRate;
            listing.CoverImageUrl = listingDto.CoverImageUrl;
            listing.IsActive = listingDto.IsActive;
            listing.MaxDistance = listingDto.MaxDistance;
            listing.RequiredEquipment = listingDto.RequiredEquipment;
            listing.DeliverableFormat = listingDto.DeliverableFormat;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteListingAsync(Guid listingId)
        {
            var listing = await _context.Listings.FindAsync(listingId);
            if (listing == null) return false;

            _context.Listings.Remove(listing);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ListingDto>> GetListingsByLocationAsync(double latitude, double longitude, double radiusKm)
        {
             var listings = await _context.Listings
                .Include(s => s.Pilot)
                .ThenInclude(p => p.AppUser)
                .Where(s => s.IsActive)
                .ToListAsync();

            return listings.Select(MapToDto);
        }

        private static ListingDto MapToDto(Listing listing)
        {
            return new ListingDto
            {
                Id = listing.Id,
                Title = listing.Title,
                Description = listing.Description,
                Category = listing.Category,
                HourlyRate = listing.HourlyRate,
                DailyRate = listing.DailyRate,
                ProjectRate = listing.ProjectRate,
                CoverImageUrl = listing.CoverImageUrl,
                IsActive = listing.IsActive,
                MaxDistance = listing.MaxDistance,
                RequiredEquipment = listing.RequiredEquipment,
                DeliverableFormat = listing.DeliverableFormat,
                PilotUserId = listing.Pilot?.AppUserId ?? string.Empty,
                PilotId = listing.PilotId,
                PilotName = listing.Pilot?.AppUser?.FullName ?? "Bilinmeyen Pilot",
                PilotIsVerified = listing.Pilot?.IsVerified ?? false,
                CreatedAt = listing.CreatedAt
            };
        }
    }
}