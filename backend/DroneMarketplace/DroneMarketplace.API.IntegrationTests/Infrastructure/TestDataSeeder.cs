using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace DroneMarketplace.API.IntegrationTests.Infrastructure;

public static class TestDataSeeder
{
    public static async Task<TestDataSnapshot> SeedAsync(IServiceProvider services)
    {
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();
        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var context = services.GetRequiredService<ApplicationDbContext>();

        foreach (var role in new[] { SystemRoles.Admin, SystemRoles.Pilot, SystemRoles.Customer })
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                var roleResult = await roleManager.CreateAsync(new IdentityRole(role));
                EnsureSucceeded(roleResult, $"Role '{role}' could not be created.");
            }
        }

        await CreateUserAsync(userManager, TestUsers.Admin, "Admin User");
        await CreateUserAsync(userManager, TestUsers.Pilot1, "Pilot One");
        await CreateUserAsync(userManager, TestUsers.Pilot2, "Pilot Two");
        await CreateUserAsync(userManager, TestUsers.Customer1, "Customer One");
        await CreateUserAsync(userManager, TestUsers.Customer2, "Customer Two");

        var pilot1 = Pilot.Create(TestUsers.Pilot1.UserId);
        pilot1.UpdateProfile("Pilot one bio", "DJI Inspire 3", "SHGM-001", null);
        pilot1.Verify();

        var pilot2 = Pilot.Create(TestUsers.Pilot2.UserId);
        pilot2.UpdateProfile("Pilot two bio", "Matrice 350 RTK", "SHGM-002", null);
        pilot2.Verify();

        context.Pilots.AddRange(pilot1, pilot2);

        var listing1 = Listing.Create(
            pilot1.Id,
            "Premium aerial shoot",
            "Professional aerial cinematography package for commercial shoots.",
            ServiceCategory.Cinematography,
            200,
            900,
            2500,
            "https://example.com/listing-1.jpg",
            100,
            "Cinema drone, ND filters",
            "4K footage");
        listing1.Activate();

        var listing2 = Listing.Create(
            pilot2.Id,
            "Inspection mission package",
            "Industrial inspection workflow for roofs, towers and facades.",
            ServiceCategory.Inspection,
            180,
            850,
            2200,
            "https://example.com/listing-2.jpg",
            80,
            "Thermal camera",
            "Inspection report");
        listing2.Activate();

        context.Listings.AddRange(listing1, listing2);

        var drone1 = Drone.Create(
            pilot1.Id,
            "Seeded Drone One",
            "DJI",
            DroneType.Photography,
            "Seeded drone owned by pilot one",
            1.2m,
            35,
            "https://example.com/drone-1.jpg");

        var drone2 = Drone.Create(
            pilot2.Id,
            "Seeded Drone Two",
            "Autel",
            DroneType.Inspection,
            "Seeded drone owned by pilot two",
            1.8m,
            32,
            "https://example.com/drone-2.jpg");

        context.Drones.AddRange(drone1, drone2);

        var startDate = DateTime.UtcNow.Date.AddDays(7);

        var customer1Booking = Booking.Create(
            listing1.Id,
            listing1,
            TestUsers.Customer1.UserId,
            startDate,
            startDate.AddDays(1),
            BookingType.Daily,
            "Istanbul",
            41.0082,
            28.9784,
            0,
            1,
            "Customer one seeded booking");

        var customer2Booking = Booking.Create(
            listing1.Id,
            listing1,
            TestUsers.Customer2.UserId,
            startDate.AddDays(2),
            startDate.AddDays(3),
            BookingType.Daily,
            "Ankara",
            39.9334,
            32.8597,
            0,
            1,
            "Customer two seeded booking");

        context.Bookings.AddRange(customer1Booking, customer2Booking);
        await context.SaveChangesAsync();

        return new TestDataSnapshot
        {
            Pilot1ProfileId = pilot1.Id,
            Pilot2ProfileId = pilot2.Id,
            Pilot1ListingId = listing1.Id,
            Pilot2ListingId = listing2.Id,
            Customer1BookingId = customer1Booking.Id,
            Customer2BookingId = customer2Booking.Id,
            Pilot1DroneId = drone1.Id,
            Pilot2DroneId = drone2.Id
        };
    }

    private static async Task CreateUserAsync(UserManager<AppUser> userManager, TestUserIdentity identity, string fullName)
    {
        var user = AppUser.Create(identity.Email, fullName);
        user.Id = identity.UserId;

        var createResult = await userManager.CreateAsync(user, TestUsers.Password);
        EnsureSucceeded(createResult, $"User '{identity.Email}' could not be created.");

        var roleResult = await userManager.AddToRolesAsync(user, identity.Roles);
        EnsureSucceeded(roleResult, $"Roles for '{identity.Email}' could not be assigned.");
    }

    private static void EnsureSucceeded(IdentityResult result, string message)
    {
        if (result.Succeeded)
        {
            return;
        }

        var errors = string.Join(", ", result.Errors.Select(e => e.Description));
        throw new InvalidOperationException($"{message} Errors: {errors}");
    }
}
