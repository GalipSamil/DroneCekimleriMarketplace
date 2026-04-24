namespace DroneMarketplace.Application.Common.Security
{
    public static class SystemRoles
    {
        public const string Admin = "Admin";
        public const string Pilot = "Pilot";
        public const string Customer = "Customer";
    }

    public sealed class ActorContext
    {
        public ActorContext(string userId, IEnumerable<string> roles)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("Actor user id boş olamaz.", nameof(userId));

            UserId = userId;
            Roles = new HashSet<string>(roles ?? Enumerable.Empty<string>(), StringComparer.OrdinalIgnoreCase);
        }

        public string UserId { get; }
        public IReadOnlySet<string> Roles { get; }

        public bool IsAdmin => Roles.Contains(SystemRoles.Admin);
        public bool IsPilot => Roles.Contains(SystemRoles.Pilot);
        public bool IsCustomer => Roles.Contains(SystemRoles.Customer);

        public bool IsInRole(string role)
        {
            return Roles.Contains(role);
        }
    }
}
