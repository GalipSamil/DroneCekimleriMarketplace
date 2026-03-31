namespace DroneMarket.API.IntegrationTests;

public abstract class IntegrationTestBase : IClassFixture<CustomWebApplicationFactory>, IAsyncLifetime
{
    protected IntegrationTestBase(CustomWebApplicationFactory factory)
    {
        Factory = factory;
    }

    protected CustomWebApplicationFactory Factory { get; }

    public Task InitializeAsync()
    {
        return Factory.ResetDatabaseAsync();
    }

    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }
}
