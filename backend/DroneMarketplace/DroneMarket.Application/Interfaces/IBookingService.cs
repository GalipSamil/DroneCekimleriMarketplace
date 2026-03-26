using DroneMarket.Application.DTOs;
using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces
{
    public interface IBookingService
    {
        Task<Guid> CreateBookingAsync(string customerId, CreateBookingDto bookingDto);
        Task<BookingDto> GetBookingAsync(Guid bookingId);
        Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(string customerId);
        Task<IEnumerable<BookingDto>> GetPilotBookingsAsync(string pilotUserId);
        Task<bool> UpdateBookingStatusAsync(Guid bookingId, BookingStatus status, string? notes = null);
        Task<bool> CancelBookingAsync(Guid bookingId, string reason);
        Task<decimal> CalculateBookingPriceAsync(Guid serviceId, BookingType type, DateTime startDate, DateTime endDate);
        Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}