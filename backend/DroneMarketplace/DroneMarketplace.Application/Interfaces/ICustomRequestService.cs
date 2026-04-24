using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.Application.Interfaces
{
    public interface ICustomRequestService
    {
        Task<CustomRequestDto> CreateAsync(CreateCustomRequestDto requestDto, string? currentUserId);
        Task<List<CustomRequestDto>> GetAllAsync();
    }
}
