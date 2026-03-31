namespace DroneMarket.API.IntegrationTests.Infrastructure;

public static class TestRequestFactory
{
    public static CreateBookingDto CreateValidBooking(Guid listingId)
    {
        var startDate = DateTime.UtcNow.Date.AddDays(14);

        return new CreateBookingDto
        {
            ListingId = listingId,
            StartDate = startDate,
            EndDate = startDate.AddDays(1),
            Type = BookingType.Daily,
            Location = "Istanbul",
            Latitude = 41.0082,
            Longitude = 28.9784,
            Days = 1,
            Hours = 0,
            CustomerNotes = "Integration test booking"
        };
    }

    public static CreateDroneDto CreateValidDrone() =>
        new()
        {
            Model = "Mavic 3 Pro",
            Brand = "DJI",
            Type = DroneType.Photography,
            Specifications = "Three-camera setup",
            Weight = 0.95m,
            MaxFlightTime = 43,
            ImageUrl = "https://example.com/mavic3.jpg"
        };

    public static UpdateDroneDto CreateValidDroneUpdate(bool isAvailable = true) =>
        new()
        {
            Model = "Inspire 3",
            Brand = "DJI",
            Type = DroneType.Commercial,
            Specifications = "Cinema payload",
            Weight = 4.3m,
            MaxFlightTime = 28,
            ImageUrl = "https://example.com/inspire3.jpg",
            IsAvailable = isAvailable
        };

    public static UpdateListingDto CreateValidListingUpdate() =>
        new()
        {
            Title = "Updated cinematic drone package",
            Description = "This is a long enough description for listing update integration testing.",
            Category = ServiceCategory.Cinematography,
            HourlyRate = 250,
            DailyRate = 1200,
            ProjectRate = 3000,
            CoverImageUrl = "https://example.com/updated-cover.jpg",
            IsActive = true,
            MaxDistance = 120,
            RequiredEquipment = "ND filters, spare batteries",
            DeliverableFormat = "4K MP4"
        };

    public static CreateListingDto CreateValidListing() =>
        new()
        {
            Title = "Commercial aerial showcase",
            Description = "Commercial drone package designed for branded shoots and launch campaigns.",
            Category = ServiceCategory.Commercial,
            HourlyRate = 300,
            DailyRate = 1400,
            ProjectRate = 4200,
            CoverImageUrl = "https://example.com/new-listing-cover.jpg",
            MaxDistance = 90,
            RequiredEquipment = "Cinema drone, ND filters",
            DeliverableFormat = "4K MP4"
        };
}
