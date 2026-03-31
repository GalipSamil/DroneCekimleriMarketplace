using System;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarketplace.Domain.Entities
{
    public class Message : BaseEntity
    {
        public string SenderId { get; private set; } = string.Empty;
        public AppUser Sender { get; private set; } = default!;

        public string ReceiverId { get; private set; } = string.Empty;
        public AppUser Receiver { get; private set; } = default!;

        public string Content { get; private set; } = string.Empty;

        public bool IsRead { get; private set; } = false;

        public DateTime SentAt { get; private set; } = DateTime.UtcNow;

        protected Message()
        {
        }

        public static Message Create(string senderId, string receiverId, string content)
        {
            if (string.IsNullOrWhiteSpace(senderId))
                throw new ArgumentException("Mesaj gönderen kullanıcı boş olamaz.");

            if (string.IsNullOrWhiteSpace(receiverId))
                throw new ArgumentException("Mesaj alıcısı boş olamaz.");

            if (senderId == receiverId)
                throw new ArgumentException("Kullanıcı kendisine mesaj gönderemez.");

            if (string.IsNullOrWhiteSpace(content))
                throw new ArgumentException("Mesaj içeriği boş olamaz.");

            return new Message
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                Content = content.Trim(),
                IsRead = false,
                SentAt = DateTime.UtcNow
            };
        }

        public bool IsParticipant(string userId)
        {
            return SenderId == userId || ReceiverId == userId;
        }

        public void MarkAsRead(string actorUserId)
        {
            if (string.IsNullOrWhiteSpace(actorUserId))
                throw new ArgumentException("Aktör kullanıcı boş olamaz.");

            if (actorUserId != ReceiverId)
                throw new ForbiddenAccessException("Mesaj yalnızca alıcısı tarafından okundu olarak işaretlenebilir.");

            if (IsRead)
            {
                return;
            }

            IsRead = true;
            Touch();
        }
    }
}
