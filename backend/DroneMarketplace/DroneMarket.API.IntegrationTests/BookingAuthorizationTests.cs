namespace DroneMarket.API.IntegrationTests;

public sealed class BookingAuthorizationTests : IntegrationTestBase
{
    public BookingAuthorizationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task GetBooking_WhenCustomerOwnsBooking_ReturnsOk()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/bookings/{Factory.CurrentData.Customer1BookingId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<BookingDto>>();
        Assert.NotNull(payload);
        Assert.True(payload!.Succeeded);
        Assert.NotNull(payload.Data);
        Assert.Equal(Factory.CurrentData.Customer1BookingId, payload.Data!.Id);
        Assert.Equal(TestUsers.Customer1.UserId, payload.Data.CustomerId);
    }

    [Fact]
    public async Task GetBooking_WhenCustomerDoesNotOwnBooking_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/bookings/{Factory.CurrentData.Customer2BookingId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task GetBooking_WhenPilotOwnsListing_ReturnsOk()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.GetAsync($"/api/bookings/{Factory.CurrentData.Customer1BookingId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetBooking_WhenPilotDoesNotOwnListing_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.GetAsync($"/api/bookings/{Factory.CurrentData.Customer1BookingId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task CancelBooking_WhenCustomerOwnsBooking_ReturnsOkAndPersistsCancelledStatus()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.PutAsJsonAsync(
            $"/api/bookings/{Factory.CurrentData.Customer1BookingId}/cancel",
            new { reason = "Plan changed" });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var status = await Factory.ExecuteDbContextAsync(async db =>
            await db.Bookings
                .Where(b => b.Id == Factory.CurrentData.Customer1BookingId)
                .Select(b => b.Status)
                .SingleAsync());

        Assert.Equal(BookingStatus.Cancelled, status);
    }

    [Fact]
    public async Task CancelBooking_WhenDifferentCustomerAttemptsCancellation_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer2);

        var response = await client.PutAsJsonAsync(
            $"/api/bookings/{Factory.CurrentData.Customer1BookingId}/cancel",
            new { reason = "Trying to cancel another booking" });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task UpdateBookingStatus_WhenPilotOwnsBookingFlow_ReturnsOkAndPersistsStatus()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PutAsJsonAsync(
            $"/api/bookings/{Factory.CurrentData.Customer1BookingId}/status",
            new UpdateBookingStatusDto
            {
                Status = BookingStatus.Accepted,
                Notes = "Pilot accepted the booking"
            });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var status = await Factory.ExecuteDbContextAsync(async db =>
            await db.Bookings
                .Where(b => b.Id == Factory.CurrentData.Customer1BookingId)
                .Select(b => b.Status)
                .SingleAsync());

        Assert.Equal(BookingStatus.Accepted, status);
    }

    [Fact]
    public async Task UpdateBookingStatus_WhenPilotDoesNotOwnBookingFlow_ReturnsForbidden()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot2);

        var response = await client.PutAsJsonAsync(
            $"/api/bookings/{Factory.CurrentData.Customer1BookingId}/status",
            new UpdateBookingStatusDto
            {
                Status = BookingStatus.Accepted,
                Notes = "This pilot does not own the listing"
            });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CanReadAndUpdateBooking()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var readResponse = await client.GetAsync($"/api/bookings/{Factory.CurrentData.Customer1BookingId}");
        Assert.Equal(HttpStatusCode.OK, readResponse.StatusCode);

        var updateResponse = await client.PutAsJsonAsync(
            $"/api/bookings/{Factory.CurrentData.Customer1BookingId}/status",
            new UpdateBookingStatusDto
            {
                Status = BookingStatus.Rejected,
                Notes = "Admin rejected the booking"
            });

        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        var status = await Factory.ExecuteDbContextAsync(async db =>
            await db.Bookings
                .Where(b => b.Id == Factory.CurrentData.Customer1BookingId)
                .Select(b => b.Status)
                .SingleAsync());

        Assert.Equal(BookingStatus.Rejected, status);
    }

    [Fact]
    public async Task UpdateBookingStatus_WhenTransitionIsInvalid_ReturnsBadRequest()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PutAsJsonAsync(
            $"/api/bookings/{Factory.CurrentData.Customer1BookingId}/status",
            new UpdateBookingStatusDto
            {
                Status = BookingStatus.Delivered,
                Notes = "Delivering a pending booking should fail"
            });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }
}
