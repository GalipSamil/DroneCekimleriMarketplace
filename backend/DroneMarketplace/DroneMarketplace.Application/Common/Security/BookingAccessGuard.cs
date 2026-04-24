using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarketplace.Application.Common.Security
{
    public static class BookingAccessGuard
    {
        public static void EnsureCanRead(Booking booking, ActorContext actor)
        {
            if (actor.IsAdmin)
            {
                return;
            }

            if (booking.CustomerId == actor.UserId)
            {
                return;
            }

            if (booking.Listing?.Pilot?.AppUserId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu rezervasyona erişim yetkiniz yok.");
        }

        public static void EnsureCustomerOrAdmin(string customerId, ActorContext actor)
        {
            if (actor.IsAdmin || actor.UserId == customerId)
            {
                return;
            }

            throw new ForbiddenAccessException("Başkasına ait müşteri rezervasyonlarını görüntüleyemezsiniz.");
        }

        public static void EnsurePilotOrAdmin(string pilotUserId, ActorContext actor)
        {
            if (actor.IsAdmin || actor.UserId == pilotUserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Başka pilota ait rezervasyonları görüntüleyemezsiniz.");
        }
    }
}
