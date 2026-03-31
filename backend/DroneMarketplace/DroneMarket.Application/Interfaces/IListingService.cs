using DroneMarket.Application.DTOs;
using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces
{
    public interface IListingService
    {
        Task<Guid> CreateListingAsync(CreateListingDto listingDto);
        Task<ListingDto?> GetListingAsync(Guid listingId);
        Task<ListingDto?> GetManagedListingAsync(Guid listingId);
        Task<IEnumerable<ListingDto>> SearchListingsAsync(string query, ServiceCategory? category = null);
        Task<IEnumerable<ListingDto>> GetPilotListingsAsync(string pilotUserId);
        Task<IEnumerable<ListingDto>> GetMyListingsAsync();
        Task<bool> UpdateListingAsync(Guid listingId, UpdateListingDto listingDto);
        Task<bool> DeleteListingAsync(Guid listingId);
        Task<bool> SetListingActivationAsync(Guid listingId, bool isActive);
        Task<IEnumerable<ListingDto>> GetListingsByLocationAsync(double latitude, double longitude, double radiusKm);
    }
}
