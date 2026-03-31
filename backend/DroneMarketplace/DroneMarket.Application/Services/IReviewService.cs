using DroneMarket.Application.Common.Security;
using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(ActorContext actor, CreateReviewDto dto);
        Task<ReviewDto?> UpdateReviewAsync(ActorContext actor, Guid reviewId, UpdateReviewDto dto);
        Task<bool> DeleteReviewAsync(ActorContext actor, Guid reviewId);
        Task<IEnumerable<ReviewDto>> GetReviewsByPilotAsync(Guid pilotId);
        Task<ReviewDto?> GetReviewByBookingAsync(ActorContext actor, Guid bookingId);
    }
}
