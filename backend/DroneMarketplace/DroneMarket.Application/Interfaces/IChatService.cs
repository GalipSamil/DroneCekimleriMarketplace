using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Interfaces
{
    public interface IChatService
    {
        Task<MessageDto> SendMessageAsync(string senderId, CreateMessageDto createMessageDto);
        Task<IEnumerable<MessageDto>> GetConversationAsync(string userId1, string userId2);
        Task<IEnumerable<MessageDto>> GetRecentMessagesAsync(string userId);
        Task<int> GetUnreadCountAsync(string userId);
        Task MarkAsReadAsync(Guid messageId);
    }
}
