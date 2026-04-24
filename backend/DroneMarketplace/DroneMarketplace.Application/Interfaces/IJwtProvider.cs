using DroneMarketplace.Domain.Entities;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IJwtProvider
    {
        string GenerateToken(AppUser user, IReadOnlyCollection<string> roles);
    }
}
