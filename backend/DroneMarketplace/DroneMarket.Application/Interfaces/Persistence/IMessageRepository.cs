using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces.Persistence
{
    public interface IMessageRepository
    {
        Task<Message?> GetByIdAsync(Guid messageId, CancellationToken cancellationToken = default);
        Task<Message?> GetByIdWithUsersAsync(Guid messageId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Message>> GetConversationAsync(string firstUserId, string secondUserId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Message>> GetRecentByUserAsync(string userId, CancellationToken cancellationToken = default);
        Task<int> CountUnreadByReceiverAsync(string receiverUserId, CancellationToken cancellationToken = default);
        Task<bool> HaveSharedBookingAsync(string firstUserId, string secondUserId, CancellationToken cancellationToken = default);
        Task<bool> UserExistsAsync(string userId, CancellationToken cancellationToken = default);
        void Add(Message message);
    }
}
