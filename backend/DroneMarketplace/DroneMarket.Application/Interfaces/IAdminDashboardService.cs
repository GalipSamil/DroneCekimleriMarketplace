using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Interfaces
{
    public interface IAdminDashboardService
    {
        Task<AdminOverviewDto> GetOverviewAsync();
        Task<List<AdminUserDto>> GetUsersAsync();
        Task<List<AdminBookingDto>> GetBookingsAsync();
    }
}
