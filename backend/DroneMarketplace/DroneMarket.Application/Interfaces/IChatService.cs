using DroneMarket.Application.Common.Security;
using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Interfaces
{
    public interface IChatService
    {
        Task<MessageDto> SendMessageAsync(ActorContext actor, CreateMessageDto createMessageDto);
        Task<IEnumerable<MessageDto>> GetConversationAsync(ActorContext actor, string otherUserId);
        Task<IEnumerable<MessageDto>> GetRecentMessagesAsync(ActorContext actor);
        Task<int> GetUnreadCountAsync(ActorContext actor);
        Task<bool> MarkAsReadAsync(ActorContext actor, Guid messageId);
    }
}
