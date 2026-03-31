using DroneMarket.Application.DTOs;
using DroneMarket.Application.Common.Security;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Services
{
    public class ListingService : IListingService
    {
        private readonly IListingRepository _listingRepository;
        private readonly IPilotRepository _pilotRepository;
        private readonly ICurrentUserService _currentUserService;
        private readonly IApplicationDbContext _context;
        private readonly IUnitOfWork _unitOfWork;

        public ListingService(
            IListingRepository listingRepository,
            IPilotRepository pilotRepository,
            ICurrentUserService currentUserService,
            IApplicationDbContext context,
            IUnitOfWork unitOfWork)
        {
            _listingRepository = listingRepository;
            _pilotRepository = pilotRepository;
            _currentUserService = currentUserService;
            _context = context;
            _unitOfWork = unitOfWork;
        }

        public async Task<Guid> CreateListingAsync(CreateListingDto listingDto)
        {
            var actor = _currentUserService.GetRequiredActor();
            if (!actor.IsPilot)
                throw new ForbiddenAccessException("İlan oluşturma işlemi yalnızca pilotlar için yetkilidir.");

            var pilot = await _pilotRepository.GetByUserIdAsync(actor.UserId);
            if (pilot == null)
                throw new InvalidOperationException("İlan oluşturmak için önce bir pilot profiline sahip olmalısınız.");

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

            _listingRepository.Add(listing);
            await _unitOfWork.SaveChangesAsync();

            return listing.Id;
        }

        public async Task<ListingDto?> GetListingAsync(Guid listingId)
        {
            var listing = await _listingRepository.GetByIdAsync(listingId);

            if (listing == null || !listing.IsActive)
            {
                return null;
            }

            var (averageRating, reviewCount) = await GetReviewStatsAsync(listing.PilotId);
            return MapToDto(listing, averageRating, reviewCount);
        }

        public async Task<ListingDto?> GetManagedListingAsync(Guid listingId)
        {
            var listing = await _listingRepository.GetByIdAsync(listingId);
            if (listing == null)
            {
                return null;
            }

            ListingAccessGuard.EnsureCanManage(listing, _currentUserService.GetRequiredActor());

            var (averageRating, reviewCount) = await GetReviewStatsAsync(listing.PilotId);
            return MapToDto(listing, averageRating, reviewCount);
        }

        public async Task<IEnumerable<ListingDto>> SearchListingsAsync(string query, ServiceCategory? category = null)
        {
            var listings = await _listingRepository.SearchActiveAsync(query, category);
            return await MapListingsAsync(listings);
        }

        public async Task<IEnumerable<ListingDto>> GetPilotListingsAsync(string pilotUserId)
        {
            var listings = await _listingRepository.GetActiveByPilotUserIdAsync(pilotUserId);
            return await MapListingsAsync(listings);
        }

        public async Task<IEnumerable<ListingDto>> GetMyListingsAsync()
        {
            var actor = _currentUserService.GetRequiredActor();
            var listings = await _listingRepository.GetByPilotUserIdAsync(actor.UserId);
            return await MapListingsAsync(listings);
        }

        public async Task<bool> UpdateListingAsync(Guid listingId, UpdateListingDto listingDto)
        {
            var listing = await _listingRepository.GetByIdAsync(listingId);
            if (listing == null) return false;

            ListingAccessGuard.EnsureCanManage(listing, _currentUserService.GetRequiredActor());

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

            ApplyActivationState(listing, listingDto.IsActive);

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteListingAsync(Guid listingId)
        {
            var listing = await _listingRepository.GetByIdAsync(listingId);
            if (listing == null) return false;

            ListingAccessGuard.EnsureCanManage(listing, _currentUserService.GetRequiredActor());

            _listingRepository.Remove(listing);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> SetListingActivationAsync(Guid listingId, bool isActive)
        {
            var listing = await _listingRepository.GetByIdAsync(listingId);
            if (listing == null) return false;

            ListingAccessGuard.EnsureCanManage(listing, _currentUserService.GetRequiredActor());
            ApplyActivationState(listing, isActive);

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ListingDto>> GetListingsByLocationAsync(double latitude, double longitude, double radiusKm)
        {
            var listings = await _listingRepository.GetActiveByLocationAsync(latitude, longitude, radiusKm);
            return await MapListingsAsync(listings);
        }

        private async Task<IEnumerable<ListingDto>> MapListingsAsync(IEnumerable<Listing> listings)
        {
            var listingList = listings.ToList();
            if (listingList.Count == 0)
            {
                return Array.Empty<ListingDto>();
            }

            var ratingMap = await GetReviewStatsByPilotIdsAsync(listingList.Select(l => l.PilotId));
            return listingList.Select(listing =>
            {
                var stats = ratingMap.TryGetValue(listing.PilotId, out var value)
                    ? value
                    : (Average: 0d, Count: 0);

                return MapToDto(listing, stats.Average, stats.Count);
            });
        }

        private async Task<(double Average, int Count)> GetReviewStatsAsync(Guid pilotId)
        {
            var ratings = await _context.Reviews
                .Where(r => r.Booking.Listing.PilotId == pilotId)
                .Select(r => r.Rating)
                .ToListAsync();

            return ratings.Count == 0
                ? (0, 0)
                : (ratings.Average(), ratings.Count);
        }

        private async Task<Dictionary<Guid, (double Average, int Count)>> GetReviewStatsByPilotIdsAsync(IEnumerable<Guid> pilotIds)
        {
            var distinctPilotIds = pilotIds.Distinct().ToList();
            if (distinctPilotIds.Count == 0)
            {
                return new Dictionary<Guid, (double Average, int Count)>();
            }

            var ratings = await _context.Reviews
                .Where(r => distinctPilotIds.Contains(r.Booking.Listing.PilotId))
                .Select(r => new { r.Rating, r.Booking.Listing.PilotId })
                .ToListAsync();

            return ratings
                .GroupBy(r => r.PilotId)
                .ToDictionary(
                    group => group.Key,
                    group => (Average: group.Average(x => x.Rating), Count: group.Count()));
        }

        private static void ApplyActivationState(Listing listing, bool isActive)
        {
            if (isActive)
            {
                listing.Activate();
            }
            else
            {
                listing.Deactivate();
            }
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
