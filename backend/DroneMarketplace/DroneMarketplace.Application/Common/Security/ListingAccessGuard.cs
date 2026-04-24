using DroneMarketplace.Domain.Entities;
using DroneMarketplace.Domain.Exceptions;

namespace DroneMarketplace.Application.Common.Security
{
    public static class ListingAccessGuard
    {
        public static void EnsureCanManage(Listing listing, ActorContext actor)
        {
            if (actor.IsAdmin)
            {
                return;
            }

            if (listing.Pilot?.AppUserId == actor.UserId)
            {
                return;
            }

            throw new ForbiddenAccessException("Bu ilan üzerinde işlem yapma yetkiniz yok.");
        }
    }
}
