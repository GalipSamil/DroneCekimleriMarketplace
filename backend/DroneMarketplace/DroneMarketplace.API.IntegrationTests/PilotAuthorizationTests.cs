namespace DroneMarketplace.API.IntegrationTests;

public sealed class PilotAuthorizationTests : IntegrationTestBase
{
    public PilotAuthorizationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task Pilot_CanUpdateOwnProfile_ReturnsOkAndPersistsChanges()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PutAsJsonAsync($"/api/pilots/profile/{TestUsers.Pilot1.UserId}", new UpdatePilotProfileDto
        {
            Bio = "Updated pilot one bio",
            EquipmentList = "DJI Inspire 3, DJI Mini 4 Pro",
            SHGMLicenseNumber = "SHGM-001-UPDATED",
            ProfileImageUrl = "https://example.com/pilot-one.png",
            Latitude = 41.015137,
            Longitude = 28.979530
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var pilot = await Factory.ExecuteDbContextAsync(async db =>
            await db.Pilots
                .Include(p => p.AppUser)
                .SingleAsync(p => p.AppUserId == TestUsers.Pilot1.UserId));

        Assert.Equal("Updated pilot one bio", pilot.Bio);
        Assert.Equal("SHGM-001-UPDATED", pilot.SHGMLicenseNumber);
        Assert.Equal("https://example.com/pilot-one.png", pilot.AppUser!.ProfilePictureUrl);
        Assert.False(pilot.IsVerified);
    }

    [Fact]
    public async Task Pilot_CannotUpdateAnotherPilotProfile_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.PutAsJsonAsync($"/api/pilots/profile/{TestUsers.Pilot1.UserId}", new UpdatePilotProfileDto
        {
            Bio = "Malicious update attempt",
            EquipmentList = "Changed by another pilot",
            SHGMLicenseNumber = "SHGM-HACK"
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Customer_CannotGetManagedPilotProfile_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/pilots/profile/{TestUsers.Pilot1.UserId}/manage");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CanReadManagedPilotProfile_WithLicenseField()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.GetAsync($"/api/pilots/profile/{TestUsers.Pilot1.UserId}/manage");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<PilotManagedProfileDto>>();
        Assert.NotNull(payload);
        Assert.Equal("SHGM-001", payload!.Data!.SHGMLicenseNumber);
    }

    [Fact]
    public async Task PublicPilotProfile_CanBeReadByAnonymousUser_WithoutLicenseField()
    {
        using var client = Factory.CreateAnonymousClient();

        var response = await client.GetAsync($"/api/pilots/profile/{TestUsers.Pilot1.UserId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var content = await response.Content.ReadAsStringAsync();
        using var document = System.Text.Json.JsonDocument.Parse(content);

        Assert.True(document.RootElement.TryGetProperty("data", out var data));
        Assert.False(data.TryGetProperty("shgmLicenseNumber", out _));
    }

    [Fact]
    public async Task SearchPilots_IsAccessibleToAnonymousUsers()
    {
        using var client = Factory.CreateAnonymousClient();

        var response = await client.GetAsync("/api/pilots/search");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<PilotPublicProfileDto>>>();
        Assert.NotNull(payload);
        Assert.NotEmpty(payload!.Data!);
    }

    [Fact]
    public async Task Admin_CanVerifyPilot()
    {
        await Factory.ExecuteDbContextAsync(async db =>
        {
            var pilot = await db.Pilots.SingleAsync(p => p.Id == Factory.CurrentData.Pilot2ProfileId);
            pilot.RevokeVerification("Reset verification state for test");
            await db.SaveChangesAsync();
        });

        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.PutAsync($"/api/pilots/{Factory.CurrentData.Pilot2ProfileId}/verify", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var isVerified = await Factory.ExecuteDbContextAsync(async db =>
            await db.Pilots
                .Where(p => p.Id == Factory.CurrentData.Pilot2ProfileId)
                .Select(p => p.IsVerified)
                .SingleAsync());

        Assert.True(isVerified);
    }

    [Fact]
    public async Task Admin_CanRevokePilotVerification()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);
        const string reason = "Compliance review";

        var response = await client.PutAsJsonAsync($"/api/pilots/{Factory.CurrentData.Pilot1ProfileId}/revoke-verification", new RevokePilotVerificationDto
        {
            Reason = reason
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var pilotState = await Factory.ExecuteDbContextAsync(async db =>
            await db.Pilots
                .Where(p => p.Id == Factory.CurrentData.Pilot1ProfileId)
                .Select(p => new { p.IsVerified, p.VerificationRejectionReason })
                .SingleAsync());

        Assert.False(pilotState.IsVerified);
        Assert.Equal(reason, pilotState.VerificationRejectionReason);
    }
}
