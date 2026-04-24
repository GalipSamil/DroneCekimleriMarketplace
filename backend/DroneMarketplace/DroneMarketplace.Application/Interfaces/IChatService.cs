using DroneMarketplace.Application.Common.Security;
using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.Application.Interfaces
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
