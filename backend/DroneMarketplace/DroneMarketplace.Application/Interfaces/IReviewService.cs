using DroneMarketplace.Application.Common.Security;
using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(ActorContext actor, CreateReviewDto dto);
        Task<bool> DeleteReviewAsync(ActorContext actor, Guid reviewId);
        Task<IEnumerable<ReviewDto>> GetReviewsByPilotAsync(Guid pilotId);
        Task<ReviewDto?> GetReviewByBookingAsync(ActorContext actor, Guid bookingId);
    }
}
