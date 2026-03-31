using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarket.Application.Common.Security
{
    public static class ReviewAccessGuard
    {
        public static void EnsureCanCreate(Booking booking, ActorContext actor)
        {
            if (booking.CustomerId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu rezervasyon için değerlendirme bırakma yetkiniz yok.");
        }

        public static void EnsureCanUpdate(Booking booking, ActorContext actor)
        {
            if (booking.CustomerId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu değerlendirmeyi yalnızca sahibi güncelleyebilir.");
        }

        public static void EnsureCanDelete(Booking booking, ActorContext actor)
        {
            if (actor.IsAdmin || booking.CustomerId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu değerlendirme üzerinde işlem yapma yetkiniz yok.");
        }
    }
}
