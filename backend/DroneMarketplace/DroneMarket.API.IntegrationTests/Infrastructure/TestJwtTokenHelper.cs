using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace DroneMarket.API.IntegrationTests.Infrastructure;

public static class TestJwtTokenHelper
{
    public static string CreateToken(string userId, string email, IEnumerable<string>? roles = null)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, userId),
            new(ClaimTypes.NameIdentifier, userId),
            new(ClaimTypes.Email, email),
            new(JwtRegisteredClaimNames.Email, email)
        };

        foreach (var role in roles ?? Enumerable.Empty<string>())
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestAuthOptions.Secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: TestAuthOptions.Issuer,
            audience: TestAuthOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
