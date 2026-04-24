namespace DroneMarketplace.API.IntegrationTests;

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
    public async Task CreateBooking_WhenCustomerOwnsValidToken_ReturnsOk()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var startDate = DateTime.UtcNow.Date.AddDays(10);
        var dto = new CreateBookingDto
        {
            ListingId = Factory.CurrentData.Pilot1ListingId,
            StartDate = startDate,
            EndDate = startDate.AddDays(1),
            Type = BookingType.Daily,
            Location = "Istanbul",
            Latitude = 41.0082,
            Longitude = 28.9784,
            Hours = 0,
            Days = 1,
            CustomerNotes = "Integration test booking"
        };

        var response = await client.PostAsJsonAsync("/api/bookings", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var bookingCount = await Factory.ExecuteDbContextAsync(async db =>
            await db.Bookings.CountAsync(b => b.CustomerId == TestUsers.Customer1.UserId));

        Assert.True(bookingCount >= 2);
    }

    [Fact]
    public async Task CreateBooking_WhenDailyBookingIncludesLargeHourValue_IgnoresHoursAndReturnsOk()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var startDate = DateTime.UtcNow.Date.AddDays(20);
        var dto = new CreateBookingDto
        {
            ListingId = Factory.CurrentData.Pilot1ListingId,
            StartDate = startDate,
            EndDate = startDate.AddDays(31),
            Type = BookingType.Daily,
            Location = "Izmir",
            Latitude = 38.4237,
            Longitude = 27.1428,
            Hours = 750,
            Days = 31,
            CustomerNotes = "Daily booking should ignore hours"
        };

        var response = await client.PostAsJsonAsync("/api/bookings", dto);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task CreateBooking_WhenDatesAreUnspecified_NormalizesAndReturnsOk()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var localBookingDate = DateTime.SpecifyKind(DateTime.UtcNow.Date.AddDays(25), DateTimeKind.Unspecified);
        var dto = new CreateBookingDto
        {
            ListingId = Factory.CurrentData.Pilot1ListingId,
            StartDate = localBookingDate,
            EndDate = localBookingDate.AddDays(2),
            Type = BookingType.Daily,
            Location = "Ankara",
            Latitude = 39.9334,
            Longitude = 32.8597,
            Hours = 0,
            Days = 2,
            CustomerNotes = "Unspecified datetime payload"
        };

        var createResponse = await client.PostAsJsonAsync("/api/bookings", dto);

        Assert.Equal(HttpStatusCode.OK, createResponse.StatusCode);

        var createPayload = await createResponse.Content.ReadFromJsonAsync<ApiResponse<Guid>>();
        Assert.NotNull(createPayload);

        var getResponse = await client.GetAsync($"/api/bookings/{createPayload!.Data}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        var bookingPayload = await getResponse.Content.ReadFromJsonAsync<ApiResponse<BookingDto>>();
        Assert.NotNull(bookingPayload);
        Assert.Equal(localBookingDate.Date, bookingPayload!.Data!.StartDate.Date);
        Assert.Equal(localBookingDate.AddDays(2).Date, bookingPayload.Data.EndDate.Date);
    }

    [Fact]
    public async Task CreateBooking_WhenTokenUserDoesNotExist_ReturnsUnauthorized()
    {
        using var client = Factory.CreateAnonymousClient();
        var token = TestJwtTokenHelper.CreateToken(
            "99999999-9999-9999-9999-999999999999",
            "missing-customer@test.local",
            new[] { SystemRoles.Customer });

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var startDate = DateTime.UtcNow.Date.AddDays(10);
        var dto = new CreateBookingDto
        {
            ListingId = Factory.CurrentData.Pilot1ListingId,
            StartDate = startDate,
            EndDate = startDate.AddDays(1),
            Type = BookingType.Daily,
            Location = "Istanbul",
            Latitude = 41.0082,
            Longitude = 28.9784,
            Hours = 0,
            Days = 1,
            CustomerNotes = "Invalid token user"
        };

        var response = await client.PostAsJsonAsync("/api/bookings", dto);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
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
