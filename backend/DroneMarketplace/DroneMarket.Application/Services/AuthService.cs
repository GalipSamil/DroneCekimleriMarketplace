using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DroneMarket.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;

        public AuthService(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IApplicationDbContext context, IConfiguration configuration, IEmailService emailService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _context = context;
            _configuration = configuration;
            _emailService = emailService;
        }

        public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
        {
            var result = await _signInManager.PasswordSignInAsync(loginDto.Email, loginDto.Password, false, false);
            if (result.Succeeded)
            {
                var user = await _userManager.FindByEmailAsync(loginDto.Email);
                if (user == null) return null;

                var isPilot = await _context.Pilots.AnyAsync(p => p.AppUserId == user.Id);
                var token = GenerateJwtToken(user, isPilot);

                return new LoginResponseDto
                {
                    UserId = user.Id,
                    IsPilot = isPilot,
                    Token = token
                };
            }
            return null;
        }

        private string GenerateJwtToken(AppUser user, bool isPilot)
        {
            var jwtSettings = _configuration.GetSection("JwtSettings");
            var key = Encoding.UTF8.GetBytes(jwtSettings.GetValue<string>("Secret"));

            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
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
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<string> RegisterAsync(RegisterDto registerDto)
        {
            var names = registerDto.FullName.Split(' ', 2);
            var firstName = names.Length > 0 ? names[0] : "";
            var lastName = names.Length > 1 ? names[1] : "";

            var user = new AppUser
            {
                UserName = registerDto.Email,
                Email = registerDto.Email,
                FullName = registerDto.FullName,
                FirstName = firstName,
                LastName = lastName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                if (registerDto.IsPilot)
                {
                    var pilot = new Pilot
                    {
                        AppUserId = user.Id,
                        SHGMLicenseNumber = "", 
                        Bio = "Hey I am a new pilot!",
                        EquipmentList = "Drone",
                        Location = new Point(0, 0) { SRID = 4326 }, // Default location
                        IsVerified = false
                    };
                    _context.Pilots.Add(pilot);
                    await _context.SaveChangesAsync();
                }

                return user.Id;
            }

            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }
        public async Task ForgotPasswordAsync(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return; // Do not reveal that user does not exist

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _emailService.SendEmailAsync(email, "Reset Password", $"Your reset token is: {token}");
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;

            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            return result.Succeeded;
        }
    }
}