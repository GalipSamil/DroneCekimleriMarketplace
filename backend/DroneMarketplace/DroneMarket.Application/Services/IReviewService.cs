using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DroneMarket.Application.DTOs;

namespace DroneMarket.Application.Services
{
    public interface IReviewService
    {
        Task<ReviewDto> CreateReviewAsync(string customerUserId, CreateReviewDto dto);
        Task<IEnumerable<ReviewDto>> GetReviewsByPilotAsync(Guid pilotId);
        Task<ReviewDto?> GetReviewByBookingAsync(Guid bookingId);
    }
}
