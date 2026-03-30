using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace DroneMarket.Infrastructure.Services
{
    public class JwtProvider : IJwtProvider
    {
        private readonly IConfiguration _configuration;

        public JwtProvider(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string GenerateToken(AppUser user, bool isPilot)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var secret = jwtSettings.GetValue<string>("Secret");
            
            if (string.IsNullOrEmpty(secret))
                throw new InvalidOperationException("JWT Secret is missing in configuration.");

            var key = Encoding.UTF8.GetBytes(secret);

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email!),
                new Claim("IsPilot", isPilot.ToString())
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(jwtSettings.GetValue<int>("ExpiryMinutes")),
                Issuer = jwtSettings.GetValue<string>("Issuer"),
                Audience = jwtSettings.GetValue<string>("Audience"),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }
    }
}
