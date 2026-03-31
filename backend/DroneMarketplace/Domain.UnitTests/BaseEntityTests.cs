namespace Domain.UnitTests;

public sealed class BaseEntityTests
{
    [Fact]
    public void Touch_SetsUpdatedAt()
    {
        var entity = new TestEntity();
        var beforeTouch = DateTime.UtcNow;

        entity.InvokeTouch();

        Assert.NotNull(entity.UpdatedAt);
        Assert.True(entity.UpdatedAt >= beforeTouch);
    }

    [Fact]
    public void SoftDelete_MarksEntityAsDeletedAndUpdatesTimestamp()
    {
        var entity = new TestEntity();
        var beforeDelete = DateTime.UtcNow;

        entity.SoftDelete();

        Assert.True(entity.IsDeleted);
        Assert.NotNull(entity.UpdatedAt);
        Assert.True(entity.UpdatedAt >= beforeDelete);
    }

    private sealed class TestEntity : BaseEntity
    {
        public void InvokeTouch()
        {
            Touch();
        }
    }
}
