using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Security;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using NetTopologySuite.Geometries;

namespace DroneMarket.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IApplicationDbContext _context;
        private readonly IEmailService _emailService;
        private readonly IJwtProvider _jwtProvider;
        private readonly IConfiguration _configuration;

        public AuthService(
            UserManager<AppUser> userManager, 
            RoleManager<IdentityRole> roleManager,
            SignInManager<AppUser> signInManager, 
            IApplicationDbContext context, 
            IEmailService emailService,
            IJwtProvider jwtProvider,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _context = context;
            _emailService = emailService;
            _jwtProvider = jwtProvider;
            _configuration = configuration;
        }

        public async Task<string> RegisterAsync(RegisterDto registerDto)
        {
            var user = AppUser.Create(registerDto.Email, registerDto.FullName);

            var result = await _userManager.CreateAsync(user, registerDto.Password);
            
            if (!result.Succeeded)
            {
                var errors = string.Join(", ", result.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Register failed: {errors}"); 
            }

            var targetRole = registerDto.IsPilot ? SystemRoles.Pilot : SystemRoles.Customer;
            await EnsureRoleExistsAsync(targetRole);
            var roleAssignment = await _userManager.AddToRoleAsync(user, targetRole);
            if (!roleAssignment.Succeeded)
            {
                var errors = string.Join(", ", roleAssignment.Errors.Select(e => e.Description));
                throw new InvalidOperationException($"Rol ataması başarısız: {errors}");
            }

            if (registerDto.IsPilot)
            {
                var pilot = Pilot.Create(user.Id);
                pilot.UpdateProfile(
                    bio: "Havacılık tutkunu yeni bir pilot!",
                    equipmentList: "Standart Drone",
                    shgmLicenseNumber: "",
                    location: new Point(0, 0) { SRID = 4326 }
                );
                
                _context.Pilots.Add(pilot);
                await _context.SaveChangesAsync();
            }

            return user.Id;
        }

        public async Task<LoginResponseDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return null;

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (!result.Succeeded) return null;

            var roles = await _userManager.GetRolesAsync(user);
            var isPilot = roles.Contains(SystemRoles.Pilot);

            if (!roles.Any())
            {
                isPilot = await _context.Pilots.AnyAsync(p => p.AppUserId == user.Id);
                var fallbackRole = isPilot ? SystemRoles.Pilot : SystemRoles.Customer;
                await EnsureRoleExistsAsync(fallbackRole);
                await _userManager.AddToRoleAsync(user, fallbackRole);
                roles = await _userManager.GetRolesAsync(user);
            }

            var token = _jwtProvider.GenerateToken(user, roles.ToArray());

            return new LoginResponseDto
            {
                UserId = user.Id,
                IsPilot = isPilot,
                Token = token
            };
        }

        public async Task ForgotPasswordAsync(string email)
        {
            if (!_configuration.GetValue<bool>("Features:EnablePasswordReset"))
                throw new InvalidOperationException("Password reset is disabled.");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return; // Do not reveal that user does not exist

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _emailService.SendEmailAsync(email, "Reset Password", $"Your reset token is: {token}");
        }

        public async Task<bool> ResetPasswordAsync(string email, string token, string newPassword)
        {
            if (!_configuration.GetValue<bool>("Features:EnablePasswordReset"))
                throw new InvalidOperationException("Password reset is disabled.");

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return false;

            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            return result.Succeeded;
        }

        private async Task EnsureRoleExistsAsync(string roleName)
        {
            if (!await _roleManager.RoleExistsAsync(roleName))
            {
                var createResult = await _roleManager.CreateAsync(new IdentityRole(roleName));
                if (!createResult.Succeeded)
                {
                    var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    throw new InvalidOperationException($"Rol oluşturulamadı: {errors}");
                }
            }
        }
    }
}
