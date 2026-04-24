namespace DroneMarketplace.API.IntegrationTests;

public sealed class AuthorizationPolicyTests : IntegrationTestBase
{
    public AuthorizationPolicyTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task ProtectedEndpoint_WhenJwtHasNoRoleClaim_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1, includeRoleClaims: false);

        var response = await client.PostAsJsonAsync(
            "/api/bookings",
            TestRequestFactory.CreateValidBooking(Factory.CurrentData.Pilot1ListingId));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task CustomerOnlyEndpoint_WhenPilotCallsIt_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PostAsJsonAsync(
            "/api/bookings",
            TestRequestFactory.CreateValidBooking(Factory.CurrentData.Pilot1ListingId));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task PilotOnlyEndpoint_WhenCustomerCallsIt_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.PostAsJsonAsync(
            "/api/drones",
            TestRequestFactory.CreateValidDrone());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminOnlyEndpoint_WhenCustomerCallsIt_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync("/api/admin/overview");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminOnlyEndpoint_WhenAdminCallsIt_ReturnsOk()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.GetAsync("/api/admin/overview");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task CustomerOnlyCreateEndpoint_WhenAdminCallsIt_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.PostAsJsonAsync(
            "/api/bookings",
            TestRequestFactory.CreateValidBooking(Factory.CurrentData.Pilot1ListingId));

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task PilotOnlyCreateEndpoint_WhenAdminCallsIt_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.PostAsJsonAsync(
            "/api/listings",
            TestRequestFactory.CreateValidListing());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }
}
