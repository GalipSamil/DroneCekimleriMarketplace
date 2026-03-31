namespace Domain.UnitTests;

public sealed class ReviewTests
{
    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void Create_WhenRatingIsOutOfRange_ThrowsArgumentOutOfRangeException(int rating)
    {
        Assert.Throws<ArgumentOutOfRangeException>(() => Review.Create(Guid.NewGuid(), rating, "Invalid rating"));
    }

    [Fact]
    public void Update_WhenInputIsValid_UpdatesFieldsAndTimestamp()
    {
        var review = Review.Create(Guid.NewGuid(), 4, "Initial review");
        var beforeUpdate = DateTime.UtcNow;

        review.Update(5, "Updated review");

        Assert.Equal(5, review.Rating);
        Assert.Equal("Updated review", review.Comment);
        Assert.NotNull(review.UpdatedAt);
        Assert.True(review.UpdatedAt >= beforeUpdate);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    public void Update_WhenRatingIsOutOfRange_ThrowsArgumentOutOfRangeException(int rating)
    {
        var review = Review.Create(Guid.NewGuid(), 4, "Initial review");

        Assert.Throws<ArgumentOutOfRangeException>(() => review.Update(rating, "Updated review"));
    }
}
