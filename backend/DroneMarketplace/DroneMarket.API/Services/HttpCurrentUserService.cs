using System.Security.Claims;
using DroneMarket.Application.Common.Security;
using DroneMarket.Application.Interfaces;

namespace DroneMarket.API.Services
{
    public sealed class HttpCurrentUserService : ICurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public HttpCurrentUserService(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public ActorContext GetRequiredActor()
        {
            return GetRequiredActor(_httpContextAccessor.HttpContext?.User);
        }

        public ActorContext GetRequiredActor(ClaimsPrincipal? principal)
        {
            var userId = principal?.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(userId))
                throw new UnauthorizedAccessException("Kimliği doğrulanmış kullanıcı bulunamadı.");

            var roles = principal!
                .FindAll(ClaimTypes.Role)
                .Select(c => c.Value);

            return new ActorContext(userId, roles);
        }
    }
}
