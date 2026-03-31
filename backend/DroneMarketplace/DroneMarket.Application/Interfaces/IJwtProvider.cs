using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces
{
    public interface IJwtProvider
    {
        string GenerateToken(AppUser user, IReadOnlyCollection<string> roles);
    }
}
