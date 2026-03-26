using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Services
{
    public class ChatService : IChatService
    {
        private readonly IApplicationDbContext _context;

        public ChatService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<MessageDto> SendMessageAsync(string senderId, CreateMessageDto createMessageDto)
        {
            var message = new Message
            {
                SenderId = senderId,
                ReceiverId = createMessageDto.ReceiverId,
                Content = createMessageDto.Content,
                SentAt = DateTime.UtcNow,
                IsRead = false
            };

            _context.Messages.Add(message);
            await _context.SaveChangesAsync();

            // Load Sender and Receiver for DTO mapping
            
            
            // Re-fetching with Include for proper data return
             var createdMessageQuery = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .FirstOrDefaultAsync(m => m.Id == message.Id);


            return MapToDto(createdMessageQuery);
        }

        public async Task<IEnumerable<MessageDto>> GetConversationAsync(string userId1, string userId2)
        {
            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => (m.SenderId == userId1 && m.ReceiverId == userId2) ||
                            (m.SenderId == userId2 && m.ReceiverId == userId1))
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            return messages.Select(MapToDto);
        }

        public async Task<IEnumerable<MessageDto>> GetRecentMessagesAsync(string userId)
        {
             // This logic gets the last message of each conversation
            var messages = await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync();

            // Group by the "other" user and key select the first one (which is the latest due to OrderByDescending)
             var recentMessages = messages
                .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
                .Select(g => g.First())
                .ToList();

            return recentMessages.Select(MapToDto);
        }

        public async Task<int> GetUnreadCountAsync(string userId)
        {
            return await _context.Messages
                .CountAsync(m => m.ReceiverId == userId && !m.IsRead);
        }

        public async Task MarkAsReadAsync(Guid messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);
            if (message != null)
            {
                message.IsRead = true;
                await _context.SaveChangesAsync();
            }
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
