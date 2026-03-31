namespace Domain.UnitTests;

public sealed class DroneTests
{
    [Fact]
    public void Create_WithValidInput_CreatesDrone()
    {
        var drone = Drone.Create(
            Guid.NewGuid(),
            "Mavic 3 Pro",
            "DJI",
            DroneType.Photography,
            "Three-camera drone",
            0.95m,
            43,
            "https://example.com/drone.jpg");

        Assert.Equal("Mavic 3 Pro", drone.Model);
        Assert.Equal("DJI", drone.Brand);
        Assert.Equal(DroneType.Photography, drone.Type);
        Assert.True(drone.IsAvailable);
        Assert.Null(drone.UpdatedAt);
    }

    [Fact]
    public void Create_WhenPilotIdIsEmpty_ThrowsArgumentException()
    {
        Assert.Throws<ArgumentException>(() => Drone.Create(
            Guid.Empty,
            "Mavic 3 Pro",
            "DJI",
            DroneType.Photography,
            "Three-camera drone",
            0.95m,
            43,
            "https://example.com/drone.jpg"));
    }

    [Theory]
    [InlineData("", "DJI")]
    [InlineData("   ", "DJI")]
    [InlineData("Mavic 3 Pro", "")]
    [InlineData("Mavic 3 Pro", "   ")]
    public void Create_WhenModelOrBrandIsInvalid_ThrowsArgumentException(string model, string brand)
    {
        Assert.Throws<ArgumentException>(() => Drone.Create(
            Guid.NewGuid(),
            model,
            brand,
            DroneType.Photography,
            "Three-camera drone",
            0.95m,
            43,
            "https://example.com/drone.jpg"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Create_WhenWeightIsNotPositive_ThrowsArgumentOutOfRangeException(decimal weight)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => Drone.Create(
            Guid.NewGuid(),
            "Mavic 3 Pro",
            "DJI",
            DroneType.Photography,
            "Three-camera drone",
            weight,
            43,
            "https://example.com/drone.jpg"));
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-5)]
    public void Create_WhenMaxFlightTimeIsNotPositive_ThrowsArgumentOutOfRangeException(int maxFlightTime)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => Drone.Create(
            Guid.NewGuid(),
            "Mavic 3 Pro",
            "DJI",
            DroneType.Photography,
            "Three-camera drone",
            0.95m,
            maxFlightTime,
            "https://example.com/drone.jpg"));
    }

    [Fact]
    public void UpdateDetails_WithValidInput_UpdatesFieldsAndUpdatedAt()
    {
        var drone = CreateDrone();
        var beforeUpdate = DateTime.UtcNow;

        drone.UpdateDetails(
            "Inspire 3",
            "DJI",
            DroneType.Commercial,
            "Cinema payload",
            4.3m,
            28,
            "https://example.com/inspire3.jpg");

        Assert.Equal("Inspire 3", drone.Model);
        Assert.Equal("DJI", drone.Brand);
        Assert.Equal(DroneType.Commercial, drone.Type);
        Assert.Equal("Cinema payload", drone.Specifications);
        Assert.Equal(4.3m, drone.Weight);
        Assert.Equal(28, drone.MaxFlightTime);
        Assert.Equal("https://example.com/inspire3.jpg", drone.ImageUrl);
        Assert.NotNull(drone.UpdatedAt);
        Assert.True(drone.UpdatedAt >= beforeUpdate);
    }

    [Fact]
    public void SetAvailability_ChangesAvailabilityAndUpdatedAt()
    {
        var drone = CreateDrone();
        var beforeUpdate = DateTime.UtcNow;

        drone.SetAvailability(false);

        Assert.False(drone.IsAvailable);
        Assert.NotNull(drone.UpdatedAt);
        Assert.True(drone.UpdatedAt >= beforeUpdate);
    }

    private static Drone CreateDrone()
    {
        return Drone.Create(
            Guid.NewGuid(),
            "Mavic 3 Pro",
            "DJI",
            DroneType.Photography,
            "Three-camera drone",
            0.95m,
            43,
            "https://example.com/drone.jpg");
    }
}
