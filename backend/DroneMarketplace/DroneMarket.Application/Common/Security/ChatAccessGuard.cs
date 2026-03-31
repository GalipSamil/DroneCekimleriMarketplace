using DroneMarketplace.Domain.Exceptions;

namespace DroneMarket.Application.Common.Security
{
    public static class ChatAccessGuard
    {
        public static void EnsureCanAccessConversation(string otherUserId, ActorContext actor, bool hasSharedBooking)
        {
            if (string.IsNullOrWhiteSpace(otherUserId))
                throw new ArgumentException("Konuşma tarafı boş olamaz.", nameof(otherUserId));

            if (otherUserId == actor.UserId)
                throw new InvalidOperationException("Kendinizle konuşma geçmişi görüntülenemez.");

            if (actor.IsAdmin || hasSharedBooking)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu kullanıcıyla konuşma geçmişine erişim yetkiniz yok.");
        }

        public static void EnsureCanSendMessage(string receiverUserId, ActorContext actor, bool hasSharedBooking)
        {
            if (string.IsNullOrWhiteSpace(receiverUserId))
                throw new ArgumentException("Mesaj alıcısı boş olamaz.", nameof(receiverUserId));

            if (receiverUserId == actor.UserId)
                throw new InvalidOperationException("Kendinize mesaj gönderemezsiniz.");

            if (actor.IsAdmin || hasSharedBooking)
            {
                return;
            }

            throw new ForbiddenAccessException("Sadece ilişkili olduğunuz kullanıcılarla mesajlaşabilirsiniz.");
        }
    }
}
