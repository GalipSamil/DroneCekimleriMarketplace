namespace Domain.UnitTests;

public sealed class BookingTests
{
    [Fact]
    public void Accept_WhenBookingIsPending_TransitionsToAccepted()
    {
        var booking = CreateBooking();

        booking.Accept("Pilot accepted the request.");

        Assert.Equal(BookingStatus.Accepted, booking.Status);
        Assert.Contains("Pilot accepted the request.", booking.PilotNotes);
        Assert.NotNull(booking.UpdatedAt);
    }

    [Fact]
    public void Accept_WhenBookingIsNotPending_ThrowsInvalidOperationException()
    {
        var booking = CreateBooking();
        booking.Accept("First accept");

        Assert.Throws<InvalidOperationException>(() => booking.Accept("Second accept"));
    }

    [Fact]
    public void Deliver_WhenBookingIsInProgress_TransitionsToDelivered()
    {
        var booking = CreateBookingInProgress();

        booking.Deliver("Files delivered.");

        Assert.Equal(BookingStatus.Delivered, booking.Status);
        Assert.Contains("Files delivered.", booking.PilotNotes);
        Assert.NotNull(booking.UpdatedAt);
    }

    [Fact]
    public void Deliver_WhenBookingIsNotInProgress_ThrowsInvalidOperationException()
    {
        var booking = CreateBooking();
        booking.Accept("Accepted");

        Assert.Throws<InvalidOperationException>(() => booking.Deliver("Too early."));
    }

    [Fact]
    public void Complete_WhenBookingIsDelivered_TransitionsToCompleted()
    {
        var booking = CreateDeliveredBooking();

        booking.Complete();

        Assert.Equal(BookingStatus.Completed, booking.Status);
        Assert.NotNull(booking.UpdatedAt);
    }

    [Fact]
    public void Complete_WhenBookingIsNotDelivered_ThrowsInvalidOperationException()
    {
        var booking = CreateBookingInProgress();

        Assert.Throws<InvalidOperationException>(() => booking.Complete());
    }

    [Fact]
    public void CancelByCustomer_WhenBookingIsInAllowedState_TransitionsToCancelled()
    {
        var booking = CreateBooking();
        booking.Accept("Accepted");

        booking.CancelByCustomer("Customer changed plans.");

        Assert.Equal(BookingStatus.Cancelled, booking.Status);
        Assert.Contains("Customer changed plans.", booking.CustomerNotes);
        Assert.NotNull(booking.UpdatedAt);
    }

    [Theory]
    [InlineData(BookingStatus.Delivered)]
    [InlineData(BookingStatus.Completed)]
    [InlineData(BookingStatus.Cancelled)]
    public void CancelByCustomer_WhenBookingIsInDisallowedState_ThrowsInvalidOperationException(BookingStatus invalidStatus)
    {
        var booking = CreateBooking();
        MoveToStatus(booking, invalidStatus);

        Assert.Throws<InvalidOperationException>(() => booking.CancelByCustomer("Should fail."));
    }

    private static Booking CreateBooking()
    {
        var listing = Listing.Create(
            Guid.NewGuid(),
            "Cinematic drone shoot",
            "Detailed cinematic drone coverage for commercial productions.",
            ServiceCategory.Cinematography,
            150m,
            800m,
            2500m,
            "https://example.com/cover.jpg",
            100,
            "Cinema camera",
            "4K MP4");

        return Booking.Create(
            listing.Id,
            listing,
            customerId: "customer-1",
            startDate: DateTime.UtcNow.Date.AddDays(5),
            endDate: DateTime.UtcNow.Date.AddDays(6),
            type: BookingType.Daily,
            location: "Istanbul",
            latitude: 41.0082,
            longitude: 28.9784,
            hours: 0,
            days: 1,
            customerNotes: "Please capture sunrise footage.");
    }

    private static Booking CreateBookingInProgress()
    {
        var booking = CreateBooking();
        booking.Accept("Accepted");
        booking.Start("Work started");
        return booking;
    }

    private static Booking CreateDeliveredBooking()
    {
        var booking = CreateBookingInProgress();
        booking.Deliver("Delivered");
        return booking;
    }

    private static void MoveToStatus(Booking booking, BookingStatus status)
    {
        switch (status)
        {
            case BookingStatus.Delivered:
                booking.Accept("Accepted");
                booking.Start("Started");
                booking.Deliver("Delivered");
                break;
            case BookingStatus.Completed:
                booking.Accept("Accepted");
                booking.Start("Started");
                booking.Deliver("Delivered");
                booking.Complete();
                break;
            case BookingStatus.Cancelled:
                booking.CancelByCustomer("Cancelled");
                break;
            default:
                throw new ArgumentOutOfRangeException(nameof(status), status, "Unsupported test status.");
        }
    }
}
