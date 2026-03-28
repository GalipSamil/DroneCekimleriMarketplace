using System.Threading.Tasks;
using DroneMarket.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace DroneMarketplace.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;
        private readonly IConfiguration _configuration;

        public AdminController(IAdminService adminService, IConfiguration configuration)
        {
            _adminService = adminService;
            _configuration = configuration;
        }

        private bool IsAdmin()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var adminEmail = _configuration["AdminSettings:Email"];
            return !string.IsNullOrEmpty(email) && email == adminEmail;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            if (!IsAdmin()) return Forbid();
            var overview = await _adminService.GetOverviewAsync();
            return Ok(overview);
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            if (!IsAdmin()) return Forbid();
            var users = await _adminService.GetUsersAsync();
            return Ok(users);
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            if (!IsAdmin()) return Forbid();
            var bookings = await _adminService.GetBookingsAsync();
            return Ok(bookings);
        }

        [HttpPut("approve-pilot/{userId}")]
        public async Task<IActionResult> ApprovePilot(string userId)
        {
            if (!IsAdmin()) return Forbid();
            var success = await _adminService.ApprovePilotAsync(userId);
            if (success) return Ok(new { message = "Pilot approved successfully." });
            return BadRequest(new { message = "Pilot not found or could not be approved." });
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            if (!IsAdmin()) return Forbid();
            
            // Prevent deleting the main admin configured in appsettings
            var adminEmail = _configuration["AdminSettings:Email"];
            var targetUser = await _adminService.GetUsersAsync(); // Using existing service to just check email safely
            var user = targetUser.Find(u => u.Id == userId);
            
            if (user != null && user.Email == adminEmail)
            {
                return BadRequest(new { message = "Cannot delete the main administrator." });
            }

            var success = await _adminService.DeleteUserAsync(userId);
            if (success) return Ok(new { message = "User deleted successfully." });
            return BadRequest(new { message = "User not found or could not be deleted." });
        }
    }
}
