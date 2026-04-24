using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Domain.Entities;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IBookingService
    {
        Task<Guid> CreateBookingAsync(CreateBookingDto bookingDto);
        Task<BookingDto> GetBookingAsync(Guid bookingId);
        Task<IEnumerable<BookingDto>> GetCustomerBookingsAsync(string customerId);
        Task<IEnumerable<BookingDto>> GetMyBookingsAsync();
        Task<IEnumerable<BookingDto>> GetPilotBookingsAsync(string pilotUserId);
        Task<bool> UpdateBookingStatusAsync(Guid bookingId, BookingStatus status, string? notes = null);
        Task<bool> CancelBookingAsync(Guid bookingId, string reason);
        Task<IEnumerable<BookingDto>> GetBookingsByDateRangeAsync(DateTime startDate, DateTime endDate);
    }
}
