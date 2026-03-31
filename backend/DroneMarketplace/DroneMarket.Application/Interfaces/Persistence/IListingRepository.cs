using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces.Persistence
{
    public interface IListingRepository
    {
        Task<Listing?> GetByIdAsync(Guid listingId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Listing>> SearchActiveAsync(string query, ServiceCategory? category = null, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Listing>> GetByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Listing>> GetActiveByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Listing>> GetActiveByLocationAsync(double latitude, double longitude, double radiusKm, CancellationToken cancellationToken = default);
        void Add(Listing listing);
        void Remove(Listing listing);
    }
}
