namespace Domain.UnitTests;

public sealed class ListingTests
{
    [Fact]
    public void Create_WhenListingIsValid_SetsActiveByDefault()
    {
        var listing = CreateValidListing();

        Assert.True(listing.IsActive);
    }

    [Fact]
    public void Activate_WhenListingHasValidPublishRequirements_SetsActive()
    {
        var listing = CreateValidListing();
        listing.Deactivate();

        listing.Activate();

        Assert.True(listing.IsActive);
        Assert.NotNull(listing.UpdatedAt);
    }

    [Fact]
    public void Create_WhenNoPricingExists_ThrowsInvalidOperationException()
    {
        Assert.Throws<InvalidOperationException>(() => Listing.Create(
            Guid.NewGuid(),
            "Aerial mapping package",
            "Detailed mapping workflow for land and construction inspections.",
            ServiceCategory.Mapping,
            0,
            0,
            0,
            "https://example.com/listing.jpg",
            75,
            "RTK drone",
            "Orthomosaic"));
    }

    [Fact]
    public void Create_WhenCoverImageIsMissing_ThrowsInvalidOperationException()
    {
        Assert.Throws<InvalidOperationException>(() => Listing.Create(
            Guid.NewGuid(),
            "Aerial mapping package",
            "Detailed mapping workflow for land and construction inspections.",
            ServiceCategory.Mapping,
            250,
            1200,
            4000,
            null,
            75,
            "RTK drone",
            "Orthomosaic"));
    }

    [Fact]
    public void UpdateDetails_WhenListingIsActiveAndRequirementsBecomeInvalid_ThrowsInvalidOperationException()
    {
        var listing = CreateValidListing();
        listing.Activate();

        Assert.Throws<InvalidOperationException>(() => listing.UpdateDetails(
            title: listing.Title,
            description: listing.Description,
            category: listing.Category,
            hourlyRate: 250,
            dailyRate: 1200,
            projectRate: 4000,
            coverImageUrl: null,
            maxDistance: listing.MaxDistance,
            requiredEquipment: listing.RequiredEquipment,
            deliverableFormat: listing.DeliverableFormat));
    }

    private static Listing CreateValidListing()
    {
        return Listing.Create(
            Guid.NewGuid(),
            "Aerial mapping package",
            "Detailed mapping workflow for land and construction inspections.",
            ServiceCategory.Mapping,
            250,
            1200,
            4000,
            "https://example.com/listing.jpg",
            75,
            "RTK drone",
            "Orthomosaic");
    }
}
