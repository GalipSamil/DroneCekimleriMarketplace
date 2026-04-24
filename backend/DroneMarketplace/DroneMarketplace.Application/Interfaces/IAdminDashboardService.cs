using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<AdminOverviewDto> GetOverviewAsync();
        Task<List<AdminUserDto>> GetUsersAsync();
        Task<List<AdminBookingDto>> GetBookingsAsync();
        Task<List<CustomRequestDto>> GetCustomRequestsAsync();
    }
}
