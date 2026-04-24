using DroneMarketplace.Application.Common.Time;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Application.Interfaces.Persistence;
using DroneMarketplace.Domain.Entities;

namespace DroneMarketplace.Application.Services
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

            var normalizedStartDate = MarketplaceDateTime.NormalizeIncoming(startDate);
            var normalizedEndDate = MarketplaceDateTime.NormalizeIncoming(endDate);
            var mockedHours = (decimal)(normalizedEndDate - normalizedStartDate).TotalHours;
            var days = (int)Math.Ceiling((normalizedEndDate - normalizedStartDate).TotalDays);

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
