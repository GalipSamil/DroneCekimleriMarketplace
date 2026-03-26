using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<Pilot> Pilots { get; }
        DbSet<Listing> Listings { get; }
        DbSet<Drone> Drones { get; }
        DbSet<Booking> Bookings { get; }
        DbSet<PilotAvailability> PilotAvailabilities { get; }
        DbSet<Review> Reviews { get; }
        DbSet<Message> Messages { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
