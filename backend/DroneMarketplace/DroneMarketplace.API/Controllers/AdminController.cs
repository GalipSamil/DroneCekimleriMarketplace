using System.Threading.Tasks;
using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Authorize(Policy = "AdminOnly")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly IAdminDashboardService _adminDashboardService;
        private readonly IAdminUserManagementService _adminUserManagementService;

        public AdminController(
            IAdminDashboardService adminDashboardService,
            IAdminUserManagementService adminUserManagementService)
        {
            _adminDashboardService = adminDashboardService;
            _adminUserManagementService = adminUserManagementService;
        }

        [HttpGet("overview")]
        public async Task<IActionResult> GetOverview()
        {
            var overview = await _adminDashboardService.GetOverviewAsync();
            return Ok(new ApiResponse<AdminOverviewDto>(overview));
        }

        [HttpGet("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _adminDashboardService.GetUsersAsync();
            return Ok(new ApiResponse<List<AdminUserDto>>(users));
        }

        [HttpGet("bookings")]
        public async Task<IActionResult> GetBookings()
        {
            var bookings = await _adminDashboardService.GetBookingsAsync();
            return Ok(new ApiResponse<List<AdminBookingDto>>(bookings));
        }

        [HttpGet("custom-requests")]
        public async Task<IActionResult> GetCustomRequests()
        {
            var requests = await _adminDashboardService.GetCustomRequestsAsync();
            return Ok(new ApiResponse<List<CustomRequestDto>>(requests));
        }

        [HttpDelete("users/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var success = await _adminUserManagementService.DeleteUserAsync(userId);
            if (success)
            {
                return Ok(new ApiResponse<bool>(true, "Kullanıcı başarıyla silindi."));
            }

            return BadRequest(new ApiResponse<string>("Kullanıcı bulunamadı veya silinemedi."));
        }
    }
}
