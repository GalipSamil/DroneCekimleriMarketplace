using DroneMarket.Infrastructure.Persistence;
using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.API.IntegrationTests.Infrastructure;

public sealed class TestApplicationDbContext : ApplicationDbContext
{
    public TestApplicationDbContext(DbContextOptions<TestApplicationDbContext> options)
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // SQLite test setup does not need spatial support; ignore Point mapping to avoid mod_spatialite dependency.
        builder.Entity<Pilot>().Ignore(p => p.Location);
    }
}
