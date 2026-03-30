using DroneMarket.Application.DTOs;
using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces
{
    public interface IListingService
    {
        Task<Guid> CreateListingAsync(string userId, CreateListingDto listingDto);
        Task<ListingDto> GetListingAsync(Guid listingId);
        Task<IEnumerable<ListingDto>> SearchListingsAsync(string query, ServiceCategory? category = null);
        Task<IEnumerable<ListingDto>> GetPilotListingsAsync(string userId);
        Task<bool> UpdateListingAsync(Guid listingId, string userId, bool isAdmin, UpdateListingDto listingDto);
        Task<bool> DeleteListingAsync(Guid listingId, string userId, bool isAdmin);
        Task<IEnumerable<ListingDto>> GetListingsByLocationAsync(double latitude, double longitude, double radiusKm);
    }
}