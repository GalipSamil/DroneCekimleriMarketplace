namespace DroneMarket.Application.Interfaces
{
    public interface IAdminUserManagementService
    {
        Task<bool> DeleteUserAsync(string userId);
    }
}
