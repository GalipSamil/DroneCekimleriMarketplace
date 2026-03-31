using System.Security.Claims;
using DroneMarket.Application.Common.Security;

namespace DroneMarket.Application.Interfaces
{
    public interface ICurrentUserService
    {
        ActorContext GetRequiredActor();
        ActorContext GetRequiredActor(ClaimsPrincipal? principal);
    }
}
