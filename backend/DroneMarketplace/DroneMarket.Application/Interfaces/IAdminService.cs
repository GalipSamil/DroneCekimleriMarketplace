using System.Collections.Generic;
using System.Threading.Tasks;
using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Interfaces
{
    public interface IAdminService
    {
        Task<AdminOverviewDto> GetOverviewAsync();
        Task<List<AdminUserDto>> GetUsersAsync();
        Task<List<AdminBookingDto>> GetBookingsAsync();
        Task<bool> ApprovePilotAsync(string userId);
        Task<bool> DeleteUserAsync(string userId);
    }
}
