namespace DroneMarketplace.API.IntegrationTests;

public sealed class ReviewAuthorizationTests : IntegrationTestBase
{
    public ReviewAuthorizationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task BookingCompletingCustomer_CanCreateReview()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.PostAsJsonAsync("/api/reviews", new CreateReviewDto
        {
            BookingId = Factory.CurrentData.Customer1BookingId,
            Rating = 5,
            Comment = "Excellent work"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var review = await Factory.ExecuteDbContextAsync(async db =>
            await db.Reviews.SingleAsync(r => r.BookingId == Factory.CurrentData.Customer1BookingId));

        Assert.Equal(5, review.Rating);
    }

    [Fact]
    public async Task UnrelatedCustomer_CannotCreateReview_ReturnsForbidden()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer2);

        var response = await client.PostAsJsonAsync("/api/reviews", new CreateReviewDto
        {
            BookingId = Factory.CurrentData.Customer1BookingId,
            Rating = 4,
            Comment = "Trying to review another booking"
        });

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task DuplicateReview_ForSameBooking_ReturnsBadRequest()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        await SeedReviewAsync(Factory.CurrentData.Customer1BookingId, 4, "First review");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.PostAsJsonAsync("/api/reviews", new CreateReviewDto
        {
            BookingId = Factory.CurrentData.Customer1BookingId,
            Rating = 5,
            Comment = "Second review"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task IncompleteBooking_CannotBeReviewed_ReturnsBadRequest()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.PostAsJsonAsync("/api/reviews", new CreateReviewDto
        {
            BookingId = Factory.CurrentData.Customer1BookingId,
            Rating = 4,
            Comment = "Too early"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Pilot_CannotDeleteReview_ReturnsForbidden()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        var reviewId = await SeedReviewAsync(Factory.CurrentData.Customer1BookingId, 4, "Initial review");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.DeleteAsync($"/api/reviews/{reviewId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task Admin_CanDeleteReview()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        var reviewId = await SeedReviewAsync(Factory.CurrentData.Customer1BookingId, 4, "Initial review");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.DeleteAsync($"/api/reviews/{reviewId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var exists = await Factory.ExecuteDbContextAsync(async db =>
            await db.Reviews.AnyAsync(r => r.Id == reviewId));

        Assert.False(exists);
    }

    [Fact]
    public async Task BookingReview_CanBeReadByBookingParticipants()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        await SeedReviewAsync(Factory.CurrentData.Customer1BookingId, 4, "Initial review");
        using var customerClient = Factory.CreateAuthenticatedClient(TestUsers.Customer1);
        using var pilotClient = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var customerResponse = await customerClient.GetAsync($"/api/reviews/booking/{Factory.CurrentData.Customer1BookingId}");
        var pilotResponse = await pilotClient.GetAsync($"/api/reviews/booking/{Factory.CurrentData.Customer1BookingId}");

        Assert.Equal(HttpStatusCode.OK, customerResponse.StatusCode);
        Assert.Equal(HttpStatusCode.OK, pilotResponse.StatusCode);
    }

    [Fact]
    public async Task BookingReview_CannotBeReadByUnrelatedUser_ReturnsForbidden()
    {
        await CompleteBookingAsync(Factory.CurrentData.Customer1BookingId);
        await SeedReviewAsync(Factory.CurrentData.Customer1BookingId, 4, "Initial review");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer2);

        var response = await client.GetAsync($"/api/reviews/booking/{Factory.CurrentData.Customer1BookingId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    private async Task CompleteBookingAsync(Guid bookingId)
    {
        await Factory.ExecuteDbContextAsync(async db =>
        {
            var booking = await db.Bookings
                .Include(b => b.Listing)
                .ThenInclude(l => l.Pilot)
                .SingleAsync(b => b.Id == bookingId);

            if (booking.Status == BookingStatus.Completed)
                return;

            if (booking.Status == BookingStatus.Pending)
                booking.Accept("Accepted for review test");

            if (booking.Status == BookingStatus.Accepted)
                booking.Start("Started for review test");

            if (booking.Status == BookingStatus.InProgress)
                booking.Deliver("Delivered for review test");

            if (booking.Status == BookingStatus.Delivered)
                booking.Complete();

            await db.SaveChangesAsync();
        });
    }

    private async Task<Guid> SeedReviewAsync(Guid bookingId, int rating, string comment)
    {
        return await Factory.ExecuteDbContextAsync(async db =>
        {
            var review = Review.Create(bookingId, rating, comment);
            db.Reviews.Add(review);
            await db.SaveChangesAsync();
            return review.Id;
        });
    }
}
