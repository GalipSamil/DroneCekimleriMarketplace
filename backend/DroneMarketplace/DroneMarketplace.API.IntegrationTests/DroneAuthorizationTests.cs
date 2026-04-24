namespace DroneMarketplace.API.IntegrationTests;

public sealed class DroneAuthorizationTests : IntegrationTestBase
{
    public DroneAuthorizationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task CreateDrone_WhenPilotCreatesOwnDrone_ReturnsCreatedAndPersistsOwnership()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PostAsJsonAsync("/api/drones", TestRequestFactory.CreateValidDrone());

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<CreatedEntityResponse>();
        Assert.NotNull(payload);

        var createdDrone = await Factory.ExecuteDbContextAsync(async db =>
            await db.Drones
                .Include(d => d.Pilot)
                .SingleAsync(d => d.Id == payload!.Id));

        Assert.Equal(TestUsers.Pilot1.UserId, createdDrone.Pilot.AppUserId);
    }

    [Fact]
    public async Task UpdateDrone_WhenPilotOwnsDrone_ReturnsOkAndPersistsChanges()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PutAsJsonAsync(
            $"/api/drones/{Factory.CurrentData.Pilot1DroneId}",
            TestRequestFactory.CreateValidDroneUpdate(isAvailable: false));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var drone = await Factory.ExecuteDbContextAsync(async db =>
            await db.Drones.SingleAsync(d => d.Id == Factory.CurrentData.Pilot1DroneId));

        Assert.Equal("Inspire 3", drone.Model);
        Assert.False(drone.IsAvailable);
    }

    [Fact]
    public async Task UpdateDrone_WhenPilotDoesNotOwnDrone_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.PutAsJsonAsync(
            $"/api/drones/{Factory.CurrentData.Pilot1DroneId}",
            TestRequestFactory.CreateValidDroneUpdate());

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task DeleteDrone_WhenPilotDoesNotOwnDrone_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.DeleteAsync($"/api/drones/{Factory.CurrentData.Pilot1DroneId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CanUpdateAnyDrone()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.PutAsJsonAsync(
            $"/api/drones/{Factory.CurrentData.Pilot2DroneId}",
            TestRequestFactory.CreateValidDroneUpdate(isAvailable: true));

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var drone = await Factory.ExecuteDbContextAsync(async db =>
            await db.Drones.SingleAsync(d => d.Id == Factory.CurrentData.Pilot2DroneId));

        Assert.Equal("Inspire 3", drone.Model);
    }

    [Fact]
    public async Task Admin_CanDeleteAnyDrone()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.DeleteAsync($"/api/drones/{Factory.CurrentData.Pilot2DroneId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var exists = await Factory.ExecuteDbContextAsync(async db =>
            await db.Drones.AnyAsync(d => d.Id == Factory.CurrentData.Pilot2DroneId));

        Assert.False(exists);
    }

    [Fact]
    public async Task SetAvailability_RespectsOwnershipRules()
    {
        using var foreignPilotClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);
        using var ownerClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var forbiddenResponse = await foreignPilotClient.PutAsJsonAsync(
            $"/api/drones/{Factory.CurrentData.Pilot1DroneId}/availability",
            new { isAvailable = false });

        Assert.Equal(HttpStatusCode.Forbidden, forbiddenResponse.StatusCode);

        var successResponse = await ownerClient.PutAsJsonAsync(
            $"/api/drones/{Factory.CurrentData.Pilot1DroneId}/availability",
            new { isAvailable = false });

        Assert.Equal(HttpStatusCode.OK, successResponse.StatusCode);

        var availability = await Factory.ExecuteDbContextAsync(async db =>
            await db.Drones
                .Where(d => d.Id == Factory.CurrentData.Pilot1DroneId)
                .Select(d => d.IsAvailable)
                .SingleAsync());

        Assert.False(availability);
    }

    private sealed class CreatedEntityResponse
    {
        public Guid Id { get; set; }
    }
}
