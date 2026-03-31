namespace DroneMarket.API.IntegrationTests;

public sealed class ListingAuthorizationTests : IntegrationTestBase
{
    public ListingAuthorizationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task CreateListing_WhenPilotCreatesOwnListing_ReturnsOkAndPersistsOwner()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PostAsJsonAsync("/api/listings", TestRequestFactory.CreateValidListing());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<Guid>>();
        Assert.NotNull(payload);
        Assert.True(payload!.Succeeded);

        var createdListing = await Factory.ExecuteDbContextAsync(async db =>
            await db.Listings
                .Include(l => l.Pilot)
                .SingleAsync(l => l.Id == payload.Data));

        Assert.Equal(TestUsers.Pilot1.UserId, createdListing.Pilot.AppUserId);
        Assert.False(createdListing.IsActive);
    }

    [Fact]
    public async Task UpdateListing_WhenPilotOwnsListing_ReturnsOkAndPersistsChanges()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}",
            TestRequestFactory.CreateValidListingUpdate());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var listing = await Factory.ExecuteDbContextAsync(async db =>
            await db.Listings.SingleAsync(l => l.Id == Factory.CurrentData.Pilot1ListingId));

        Assert.Equal("Updated cinematic drone package", listing.Title);
        Assert.True(listing.IsActive);
    }

    [Fact]
    public async Task UpdateListing_WhenPilotDoesNotOwnListing_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}",
            TestRequestFactory.CreateValidListingUpdate());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CanUpdateAnyListing()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot2ListingId}",
            TestRequestFactory.CreateValidListingUpdate());

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var listing = await Factory.ExecuteDbContextAsync(async db =>
            await db.Listings.SingleAsync(l => l.Id == Factory.CurrentData.Pilot2ListingId));

        Assert.Equal("Updated cinematic drone package", listing.Title);
    }

    [Fact]
    public async Task SetActivation_WhenForeignPilotAttemptsUpdate_ReturnsForbidden()
    {
        using var foreignPilotClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var forbiddenResponse = await foreignPilotClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });

        Assert.Equal(HttpStatusCode.Forbidden, forbiddenResponse.StatusCode);

        var successResponse = await ownerClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });

        Assert.Equal(HttpStatusCode.OK, successResponse.StatusCode);

        var isActive = await Factory.ExecuteDbContextAsync(async db =>
            await db.Listings
                .Where(l => l.Id == Factory.CurrentData.Pilot1ListingId)
                .Select(l => l.IsActive)
                .SingleAsync());

        Assert.False(isActive);
    }

    [Fact]
    public async Task GetManagedListing_WhenOwnerRequestsInactiveListing_ReturnsOk()
    {
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var deactivateResponse = await ownerClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });
        Assert.Equal(HttpStatusCode.OK, deactivateResponse.StatusCode);

        var response = await ownerClient.GetAsync($"/api/listings/{Factory.CurrentData.Pilot1ListingId}/manage");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<ListingDto>>();
        Assert.NotNull(payload);
        Assert.False(payload!.Data!.IsActive);
    }

    [Fact]
    public async Task GetManagedListing_WhenForeignPilotRequestsOwnerOnlyDetail_ReturnsForbidden()
    {
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);
        using var foreignPilotClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var deactivateResponse = await ownerClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });
        Assert.Equal(HttpStatusCode.OK, deactivateResponse.StatusCode);

        var response = await foreignPilotClient.GetAsync($"/api/listings/{Factory.CurrentData.Pilot1ListingId}/manage");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetListing_WhenListingIsInactive_ReturnsNotFoundForPublicRequests()
    {
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);
        using var anonymousClient = Factory.CreateAnonymousClient();

        var deactivateResponse = await ownerClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });
        Assert.Equal(HttpStatusCode.OK, deactivateResponse.StatusCode);

        var response = await anonymousClient.GetAsync($"/api/listings/{Factory.CurrentData.Pilot1ListingId}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetPilotListings_WhenListingIsInactive_ReturnsOnlyPublicActiveListings()
    {
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);
        using var anonymousClient = Factory.CreateAnonymousClient();

        var deactivateResponse = await ownerClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });
        Assert.Equal(HttpStatusCode.OK, deactivateResponse.StatusCode);

        var response = await anonymousClient.GetAsync($"/api/listings/pilot/{TestUsers.Pilot1.UserId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<ListingDto>>>();
        Assert.NotNull(payload);
        Assert.Empty(payload!.Data!);
    }

    [Fact]
    public async Task GetMyListings_WhenOwnerHasInactiveListing_ReturnsManagedListingsIncludingInactive()
    {
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var deactivateResponse = await ownerClient.PutAsJsonAsync(
            $"/api/listings/{Factory.CurrentData.Pilot1ListingId}/activation",
            new SetListingActivationDto { IsActive = false });
        Assert.Equal(HttpStatusCode.OK, deactivateResponse.StatusCode);

        var response = await ownerClient.GetAsync("/api/listings/my-listings");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<ListingDto>>>();
        Assert.NotNull(payload);

        var listing = Assert.Single(payload!.Data!);
        Assert.Equal(Factory.CurrentData.Pilot1ListingId, listing.Id);
        Assert.False(listing.IsActive);
    }
}
