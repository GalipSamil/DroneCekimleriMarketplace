namespace DroneMarket.API.IntegrationTests.Infrastructure;

public sealed record TestUserIdentity(string UserId, string Email, IReadOnlyCollection<string> Roles);

public static class TestUsers
{
    public const string Password = "Passw0rd!";

    public static readonly TestUserIdentity Admin = new(
        "11111111-1111-1111-1111-111111111111",
        "admin@test.local",
        new[] { SystemRoles.Admin });

    public static readonly TestUserIdentity Pilot1 = new(
        "22222222-2222-2222-2222-222222222222",
        "pilot1@test.local",
        new[] { SystemRoles.Pilot });

    public static readonly TestUserIdentity Pilot2 = new(
        "33333333-3333-3333-3333-333333333333",
        "pilot2@test.local",
        new[] { SystemRoles.Pilot });

    public static readonly TestUserIdentity Customer1 = new(
        "44444444-4444-4444-4444-444444444444",
        "customer1@test.local",
        new[] { SystemRoles.Customer });

    public static readonly TestUserIdentity Customer2 = new(
        "55555555-5555-5555-5555-555555555555",
        "customer2@test.local",
        new[] { SystemRoles.Customer });

    public static IReadOnlyList<TestUserIdentity> All =>
        new[] { Admin, Pilot1, Pilot2, Customer1, Customer2 };
}
