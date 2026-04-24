using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarketplace.Application.Common.Security
{
    public static class PilotAccessGuard
    {
        public static void EnsureCanUpsertOwnProfile(string targetUserId, ActorContext actor)
        {
            if (actor.IsPilot && actor.UserId == targetUserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Sadece kendi pilot profilinizi güncelleyebilirsiniz.");
        }

        public static void EnsureCanReadManagedProfile(Pilot pilot, ActorContext actor)
        {
            if (actor.IsAdmin || pilot.AppUserId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu pilot profilinin yönetim detaylarını görme yetkiniz yok.");
        }
    }
}
