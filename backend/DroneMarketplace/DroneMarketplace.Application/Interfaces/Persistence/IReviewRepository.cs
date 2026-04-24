using DroneMarketplace.Domain.Entities;

namespace DroneMarketplace.Application.Interfaces.Persistence
{
    public interface IReviewRepository
    {
        Task<Review?> GetByIdWithAccessGraphAsync(Guid reviewId, CancellationToken cancellationToken = default);
        Task<Review?> GetByBookingIdWithAccessGraphAsync(Guid bookingId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Review>> GetByPilotIdAsync(Guid pilotId, CancellationToken cancellationToken = default);
        Task<bool> ExistsByBookingIdAsync(Guid bookingId, CancellationToken cancellationToken = default);
        void Add(Review review);
        void Remove(Review review);
    }
}
