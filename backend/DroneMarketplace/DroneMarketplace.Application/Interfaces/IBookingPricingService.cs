using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Domain.Entities;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IBookingPricingService
    {
        Task<decimal> CalculateBookingPriceAsync(Guid serviceId, BookingType type, DateTime startDate, DateTime endDate);
    }
}
