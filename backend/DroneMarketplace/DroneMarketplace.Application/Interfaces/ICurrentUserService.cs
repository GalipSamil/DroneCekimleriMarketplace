using System.Security.Claims;
using DroneMarketplace.Application.Common.Security;

namespace DroneMarketplace.Application.Interfaces
{
    public interface ICurrentUserService
    {
        ActorContext GetRequiredActor();
        ActorContext GetRequiredActor(ClaimsPrincipal? principal);
    }
}
