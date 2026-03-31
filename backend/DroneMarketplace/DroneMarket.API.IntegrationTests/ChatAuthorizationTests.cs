namespace DroneMarket.API.IntegrationTests;

public sealed class ChatAuthorizationTests : IntegrationTestBase
{
    public ChatAuthorizationTests(CustomWebApplicationFactory factory) : base(factory)
    {
    }

    [Fact]
    public async Task User_CanViewOwnConversation_WithRelatedParticipant()
    {
        await SeedMessageAsync(TestUsers.Customer1.UserId, TestUsers.Pilot1.UserId, "Conversation seed");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/chat/conversation/{TestUsers.Pilot1.UserId}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<MessageDto>>>();
        Assert.NotNull(payload);
        Assert.Single(payload!.Data!);
    }

    [Fact]
    public async Task User_CannotViewUnrelatedConversation_ReturnsForbidden()
    {
        await SeedMessageAsync(TestUsers.Customer1.UserId, TestUsers.Pilot1.UserId, "Conversation seed");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.GetAsync($"/api/chat/conversation/{TestUsers.Pilot2.UserId}");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task User_CanSendMessage_OnlyToRelatedParticipant()
    {
        using var allowedClient = Factory.CreateAuthenticatedClient(TestUsers.Customer1);
        using var blockedClient = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var allowedResponse = await allowedClient.PostAsJsonAsync("/api/chat/messages", new CreateMessageDto
        {
            ReceiverId = TestUsers.Pilot1.UserId,
            Content = "Hello related pilot"
        });

        Assert.Equal(HttpStatusCode.OK, allowedResponse.StatusCode);

        var blockedResponse = await blockedClient.PostAsJsonAsync("/api/chat/messages", new CreateMessageDto
        {
            ReceiverId = TestUsers.Pilot2.UserId,
            Content = "Hello unrelated pilot"
        });

        Assert.Equal(HttpStatusCode.Forbidden, blockedResponse.StatusCode);
    }

    [Fact]
    public async Task Receiver_CanMarkAsRead()
    {
        var messageId = await SeedMessageAsync(TestUsers.Pilot1.UserId, TestUsers.Customer1.UserId, "Unread for receiver");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Customer1);

        var response = await client.PutAsync($"/api/chat/messages/{messageId}/read", content: null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var isRead = await Factory.ExecuteDbContextAsync(async db =>
            await db.Messages
                .Where(m => m.Id == messageId)
                .Select(m => m.IsRead)
                .SingleAsync());

        Assert.True(isRead);
    }

    [Fact]
    public async Task Sender_CannotMarkAsRead_ReturnsForbidden()
    {
        var messageId = await SeedMessageAsync(TestUsers.Pilot1.UserId, TestUsers.Customer1.UserId, "Unread for sender");
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.PutAsync($"/api/chat/messages/{messageId}/read", content: null);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task RecentMessages_ReturnOnlyActorsOwnThreads()
    {
        await SeedMessageAsync(TestUsers.Pilot1.UserId, TestUsers.Customer1.UserId, "Pilot1 and customer1");
        await SeedMessageAsync(TestUsers.Pilot1.UserId, TestUsers.Customer2.UserId, "Pilot1 and customer2");
        await SeedMessageAsync(TestUsers.Pilot2.UserId, TestUsers.Customer1.UserId, "Should not be allowed but also not in actor inbox");

        using var client = Factory.CreateAuthenticatedClient(TestUsers.Pilot1);

        var response = await client.GetAsync("/api/chat/recent");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var payload = await response.Content.ReadFromJsonAsync<ApiResponse<IEnumerable<MessageDto>>>();
        Assert.NotNull(payload);
        Assert.Equal(2, payload!.Data!.Count());
        Assert.All(payload.Data!, message => Assert.True(message.SenderId == TestUsers.Pilot1.UserId || message.ReceiverId == TestUsers.Pilot1.UserId));
    }

    [Fact]
    public async Task Admin_CanSendMessage_ToAnyUser()
    {
        using var client = Factory.CreateAuthenticatedClient(TestUsers.Admin);

        var response = await client.PostAsJsonAsync("/api/chat/messages", new CreateMessageDto
        {
            ReceiverId = TestUsers.Customer1.UserId,
            Content = "Admin support message"
        });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    private async Task<Guid> SeedMessageAsync(string senderId, string receiverId, string content)
    {
        return await Factory.ExecuteDbContextAsync(async db =>
        {
            var message = Message.Create(senderId, receiverId, content);
            db.Messages.Add(message);
            await db.SaveChangesAsync();
            return message.Id;
        });
    }
}
