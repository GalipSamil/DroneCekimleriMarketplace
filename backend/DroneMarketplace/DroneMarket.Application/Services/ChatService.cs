using DroneMarket.Application.DTOs;
using DroneMarket.Application.Common.Security;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly IMessageRepository _messageRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ChatService(IMessageRepository messageRepository, IUnitOfWork unitOfWork)
        {
            _messageRepository = messageRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<MessageDto> SendMessageAsync(ActorContext actor, CreateMessageDto createMessageDto)
        {
            if (!await _messageRepository.UserExistsAsync(createMessageDto.ReceiverId))
                throw new KeyNotFoundException("Mesaj gönderilecek kullanıcı bulunamadı.");

            var hasSharedBooking = await _messageRepository.HaveSharedBookingAsync(actor.UserId, createMessageDto.ReceiverId);
            ChatAccessGuard.EnsureCanSendMessage(createMessageDto.ReceiverId, actor, hasSharedBooking);

            var message = Message.Create(actor.UserId, createMessageDto.ReceiverId, createMessageDto.Content);
            _messageRepository.Add(message);
            await _unitOfWork.SaveChangesAsync();

            var createdMessage = await _messageRepository.GetByIdWithUsersAsync(message.Id);
            if (createdMessage == null)
                throw new InvalidOperationException("Yeni oluşturulan mesaj yüklenemedi.");

            return MapToDto(createdMessage);
        }

        public async Task<IEnumerable<MessageDto>> GetConversationAsync(ActorContext actor, string otherUserId)
        {
            if (!await _messageRepository.UserExistsAsync(otherUserId))
                throw new KeyNotFoundException("Konuşma tarafı bulunamadı.");

            var hasSharedBooking = await _messageRepository.HaveSharedBookingAsync(actor.UserId, otherUserId);
            ChatAccessGuard.EnsureCanAccessConversation(otherUserId, actor, hasSharedBooking);

            var messages = await _messageRepository.GetConversationAsync(actor.UserId, otherUserId);
            return messages.Select(MapToDto);
        }

        public async Task<IEnumerable<MessageDto>> GetRecentMessagesAsync(ActorContext actor)
        {
            var messages = await _messageRepository.GetRecentByUserAsync(actor.UserId);

            var recentMessages = messages
                .GroupBy(m => m.SenderId == actor.UserId ? m.ReceiverId : m.SenderId)
                .Select(g => g.First())
                .ToList();

            return recentMessages.Select(MapToDto);
        }

        public async Task<int> GetUnreadCountAsync(ActorContext actor)
        {
            return await _messageRepository.CountUnreadByReceiverAsync(actor.UserId);
        }

        public async Task<bool> MarkAsReadAsync(ActorContext actor, Guid messageId)
        {
            var message = await _messageRepository.GetByIdAsync(messageId);
            if (message == null)
                return false;

            message.MarkAsRead(actor.UserId);
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        private static MessageDto MapToDto(Message message)
        {
            return new MessageDto
            {
                Id = message.Id,
                SenderId = message.SenderId,
                SenderName = message.Sender?.FullName ?? "Unknown", // Safe navigation
                ReceiverId = message.ReceiverId,
                ReceiverName = message.Receiver?.FullName ?? "Unknown",
                Content = message.Content,
                IsRead = message.IsRead,
                SentAt = message.SentAt
            };
        }
    }
}
