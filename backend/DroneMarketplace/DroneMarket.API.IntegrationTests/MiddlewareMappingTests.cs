namespace DroneMarket.API.IntegrationTests;

public sealed class MiddlewareMappingTests : IntegrationTestBase
{
    public MiddlewareMappingTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task ForbiddenAccessException_IsMappedTo403()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/bookings/{Factory.CurrentData.Customer2BookingId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task KeyNotFoundException_IsMappedTo404()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.GetAsync($"/api/bookings/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task ForbiddenAccessException_IsMappedTo403_ForListingOwnershipViolations()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}",
            TestRequestFactory.CreateValidListingUpdate());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ForbiddenAccessException_IsMappedTo403_ForChatOwnershipViolations()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/chat/conversation/{TestUsers.Pilot2.UserId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ForbiddenAccessException_IsMappedTo403_ForReviewOwnershipViolations()
    {
        await Factory.ExecuteDbContextAsync(async db =>
        {
            var booking = await db.Bookings
                .SingleAsync(b => b.Id == Factory.CurrentData.Customer1BookingId);
            booking.Accept("Accepted");
            booking.Start("Started");
            booking.Deliver("Delivered");
            booking.Complete();

            db.Reviews.Add(Review.Create(Factory.CurrentData.Customer1BookingId, 4, "Seed review"));
            await db.SaveChangesAsync();
        });

        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var reviewId = await Factory.ExecuteDbContextAsync(async db =>
            await db.Reviews
                .Where(r => r.BookingId == Factory.CurrentData.Customer1BookingId)
                .Select(r => r.Id)
                .SingleAsync());

        var response = await client.PutAsJsonAsync($"/api/reviews/{reviewId}", new UpdateReviewDto
        {
            Rating = 1,
            Comment = "Pilot cannot edit"
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ForbiddenAccessException_IsMappedTo403_ForPilotProfileOwnershipViolations()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.PutAsJsonAsync($"/api/pilots/profile/{TestUsers.Pilot1.UserId}", new UpdatePilotProfileDto
        {
            Bio = "Foreign pilot update attempt",
            EquipmentList = "Unauthorized update",
            SHGMLicenseNumber = "SHGM-UNAUTHORIZED"
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task ValidationErrors_Return400()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PostAsJsonAsync("/api/drones", new CreateDroneDto
        {
            Model = "A",
            Brand = "",
            Type = DroneType.Photography,
            Specifications = "Invalid request",
            Weight = 0,
            MaxFlightTime = 0,
            ImageUrl = "not-a-url"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
