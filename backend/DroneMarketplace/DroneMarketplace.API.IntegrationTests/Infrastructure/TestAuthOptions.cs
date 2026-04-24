namespace DroneMarketplace.API.IntegrationTests.Infrastructure;

public static class TestAuthOptions
{
    public const string Issuer = "DroneMarket.IntegrationTests";
    public const string Audience = "DroneMarket.IntegrationTests";
    public const string Secret = "integration-tests-secret-key-with-at-least-32-bytes";
}
