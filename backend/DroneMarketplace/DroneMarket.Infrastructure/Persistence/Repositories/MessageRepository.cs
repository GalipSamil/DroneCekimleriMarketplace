using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Infrastructure.Persistence.Repositories
{
    public sealed class MessageRepository : IMessageRepository
    {
        private readonly ApplicationDbContext _context;

        public MessageRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Message?> GetByIdAsync(Guid messageId, CancellationToken cancellationToken = default)
        {
            return await _context.Messages
                .FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken);
        }

        public async Task<Message?> GetByIdWithUsersAsync(Guid messageId, CancellationToken cancellationToken = default)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .FirstOrDefaultAsync(m => m.Id == messageId, cancellationToken);
        }

        public async Task<IReadOnlyList<Message>> GetConversationAsync(string firstUserId, string secondUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m =>
                    (m.SenderId == firstUserId && m.ReceiverId == secondUserId) ||
                    (m.SenderId == secondUserId && m.ReceiverId == firstUserId))
                .OrderBy(m => m.SentAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<IReadOnlyList<Message>> GetRecentByUserAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Receiver)
                .Where(m => m.SenderId == userId || m.ReceiverId == userId)
                .OrderByDescending(m => m.SentAt)
                .ToListAsync(cancellationToken);
        }

        public async Task<int> CountUnreadByReceiverAsync(string receiverUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Messages
                .CountAsync(m => m.ReceiverId == receiverUserId && !m.IsRead, cancellationToken);
        }

        public async Task<bool> HaveSharedBookingAsync(string firstUserId, string secondUserId, CancellationToken cancellationToken = default)
        {
            return await _context.Bookings
                .Include(b => b.Listing)
                    .ThenInclude(l => l.Pilot)
                .AnyAsync(
                    b => (b.CustomerId == firstUserId && b.Listing.Pilot.AppUserId == secondUserId) ||
                         (b.CustomerId == secondUserId && b.Listing.Pilot.AppUserId == firstUserId),
                    cancellationToken);
        }

        public async Task<bool> UserExistsAsync(string userId, CancellationToken cancellationToken = default)
        {
            return await _context.Users.AnyAsync(u => u.Id == userId, cancellationToken);
        }

        public void Add(Message message)
        {
            _context.Messages.Add(message);
        }
    }
}
