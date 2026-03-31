using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Security;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace DroneMarket.Application.Services
{
    public sealed class AdminUserManagementService : IAdminUserManagementService
    {
        private readonly UserManager<AppUser> _userManager;

        public AdminUserManagementService(
            UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains(SystemRoles.Admin))
            {
                return false;
            }

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
        }
    }
}
