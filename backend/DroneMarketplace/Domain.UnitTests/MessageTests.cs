namespace Domain.UnitTests;

public sealed class MessageTests
{
    [Theory]
    [InlineData("", "receiver-1", "hello")]
    [InlineData("sender-1", "", "hello")]
    [InlineData("sender-1", "sender-1", "hello")]
    [InlineData("sender-1", "receiver-1", "")]
    [InlineData("sender-1", "receiver-1", "   ")]
    public void Create_WhenRequiredFieldsAreEmpty_ThrowsArgumentException(string senderId, string receiverId, string content)
    {
        Assert.Throws<ArgumentException>(() => Message.Create(senderId, receiverId, content));
    }

    [Fact]
    public void MarkAsRead_WhenCalledByReceiver_MarksMessageAsRead()
    {
        var message = Message.Create("sender-1", "receiver-1", " Hello ");
        var beforeMarkAsRead = DateTime.UtcNow;

        message.MarkAsRead("receiver-1");

        Assert.True(message.IsRead);
        Assert.Equal("Hello", message.Content);
        Assert.NotNull(message.UpdatedAt);
        Assert.True(message.UpdatedAt >= beforeMarkAsRead);
    }

    [Fact]
    public void MarkAsRead_WhenCalledBySender_ThrowsForbiddenAccessException()
    {
        var message = Message.Create("sender-1", "receiver-1", "Hello");

        Assert.Throws<ForbiddenAccessException>(() => message.MarkAsRead("sender-1"));
    }

    [Fact]
    public void IsParticipant_WhenUserBelongsToMessage_ReturnsTrue()
    {
        var message = Message.Create("sender-1", "receiver-1", "Hello");

        Assert.True(message.IsParticipant("sender-1"));
        Assert.True(message.IsParticipant("receiver-1"));
        Assert.False(message.IsParticipant("someone-else"));
    }
}
