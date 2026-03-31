using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Interfaces.Persistence
{
    public interface IBookingRepository
    {
        Task<Booking?> GetByIdWithAccessGraphAsync(Guid bookingId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Booking>> GetByCustomerIdAsync(string customerId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Booking>> GetByPilotUserIdAsync(string pilotUserId, CancellationToken cancellationToken = default);
        Task<IReadOnlyList<Booking>> GetByDateRangeAsync(DateTime startDate, DateTime endDate, CancellationToken cancellationToken = default);
        void Add(Booking booking);
    }
}
