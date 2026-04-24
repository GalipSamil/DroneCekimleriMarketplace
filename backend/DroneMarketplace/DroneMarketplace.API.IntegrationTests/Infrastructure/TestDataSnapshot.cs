namespace DroneMarketplace.API.IntegrationTests.Infrastructure;

public sealed class TestDataSnapshot
{
    public required Guid Pilot1ProfileId { get; init; }
    public required Guid Pilot2ProfileId { get; init; }
    public required Guid Pilot1ListingId { get; init; }
    public required Guid Pilot2ListingId { get; init; }
    public required Guid Customer1BookingId { get; init; }
    public required Guid Customer2BookingId { get; init; }
    public required Guid Pilot1DroneId { get; init; }
    public required Guid Pilot2DroneId { get; init; }
}
