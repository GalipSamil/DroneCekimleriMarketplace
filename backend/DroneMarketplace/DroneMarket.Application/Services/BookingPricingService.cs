using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;

namespace DroneMarket.Application.Services
{
    public sealed class BookingPricingService : IBookingPricingService
    {
        private readonly IListingRepository _listingRepository;

        public BookingPricingService(IListingRepository listingRepository)
        {
            _listingRepository = listingRepository;
        }

        public async Task<decimal> CalculateBookingPriceAsync(Guid serviceId, BookingType type, DateTime startDate, DateTime endDate)
        {
            var listing = await _listingRepository.GetByIdAsync(serviceId);
            if (listing == null)
                throw new KeyNotFoundException("Listing not found");

            var mockedHours = (decimal)(endDate - startDate).TotalHours;
            var days = (int)Math.Ceiling((endDate - startDate).TotalDays);

            return type switch
            {
                BookingType.Hourly => listing.HourlyRate * mockedHours,
                BookingType.Daily => listing.DailyRate * (days <= 0 ? 1 : days),
                BookingType.Project => listing.ProjectRate,
                _ => 0
            };
        }
    }
}
