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
            if (pilot == null) throw new UnauthorizedAccessException("Sadece pilot olarak onaylanmış kullanıcılar ilan açabilir.");

            var listing = Listing.Create(
                pilotId: pilot.Id,
                title: listingDto.Title,
                description: listingDto.Description,
                category: listingDto.Category,
                hourlyRate: listingDto.HourlyRate,
                dailyRate: listingDto.DailyRate,
                projectRate: listingDto.ProjectRate,
                coverImageUrl: listingDto.CoverImageUrl,
                maxDistance: listingDto.MaxDistance,
                requiredEquipment: listingDto.RequiredEquipment,
                deliverableFormat: listingDto.DeliverableFormat
            );

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

            var reviews = await _context.Reviews
                .Where(r => r.Booking.Listing.PilotId == listing.PilotId)
                .ToListAsync();

            return MapToDto(listing, reviews.Count > 0 ? reviews.Average(r => r.Rating) : 0, reviews.Count);
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

            // Batch fetch reviews per pilot to avoid N+1
            var pilotIds = listings.Select(l => l.PilotId).Distinct().ToList();
            var allReviews = await _context.Reviews
                .Where(r => pilotIds.Contains(r.Booking.Listing.PilotId))
                .Select(r => new { r.Rating, r.Booking.Listing.PilotId })
                .ToListAsync();

            return listings.Select(l => {
                var pr = allReviews.Where(r => r.PilotId == l.PilotId).ToList();
                return MapToDto(l, pr.Count > 0 ? pr.Average(r => r.Rating) : 0, pr.Count);
            });
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

            var allReviews = await _context.Reviews
                .Where(r => r.Booking.Listing.PilotId == pilot.Id)
                .Select(r => new { r.Rating, r.Booking.Listing.PilotId })
                .ToListAsync();

            var avgRating = allReviews.Count > 0 ? allReviews.Average(r => r.Rating) : 0;
            var reviewCount = allReviews.Count;

            return listings.Select(l => MapToDto(l, avgRating, reviewCount));
        }

        public async Task<bool> UpdateListingAsync(Guid listingId, string userId, bool isAdmin, UpdateListingDto listingDto)
        {
            var listing = await _context.Listings
                .Include(l => l.Pilot)
                .FirstOrDefaultAsync(l => l.Id == listingId);
                
            if (listing == null) return false;

            // Security check: Must own the listing or be an Admin
            if (listing.Pilot.AppUserId != userId && !isAdmin)
                throw new UnauthorizedAccessException("Bu ilanı güncelleme yetkiniz yok.");

            // Domain method handles property assignment
            listing.UpdateDetails(
                title: listingDto.Title,
                description: listingDto.Description,
                category: listingDto.Category,
                hourlyRate: listingDto.HourlyRate,
                dailyRate: listingDto.DailyRate,
                projectRate: listingDto.ProjectRate,
                coverImageUrl: listingDto.CoverImageUrl,
                maxDistance: listingDto.MaxDistance,
                requiredEquipment: listingDto.RequiredEquipment,
                deliverableFormat: listingDto.DeliverableFormat
            );

            if (listingDto.IsActive)
                listing.Activate();
            else
                listing.Deactivate();

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteListingAsync(Guid listingId, string userId, bool isAdmin)
        {
            var listing = await _context.Listings
                .Include(l => l.Pilot)
                .FirstOrDefaultAsync(l => l.Id == listingId);

            if (listing == null) return false;

            // Security check: Must own the listing or be an Admin
            if (listing.Pilot.AppUserId != userId && !isAdmin)
                throw new UnauthorizedAccessException("Bu ilanı silme yetkiniz yok.");

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

            return listings.Select(l => MapToDto(l, 0, 0));
        }

        private static ListingDto MapToDto(Listing listing, double averageRating = 0, int reviewCount = 0)
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
                AverageRating = Math.Round(averageRating, 1),
                ReviewCount = reviewCount,
                CreatedAt = listing.CreatedAt
            };
        }
    }
}