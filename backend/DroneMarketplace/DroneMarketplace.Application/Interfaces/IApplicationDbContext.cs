using DroneMarketplace.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace DroneMarketplace.Application.Interfaces
{
    public interface IApplicationDbContext
    {
        DbSet<AppUser> Users { get; }
        DbSet<Pilot> Pilots { get; }
        DbSet<Listing> Listings { get; }
        DbSet<Drone> Drones { get; }
        DbSet<Booking> Bookings { get; }
        DbSet<PilotAvailability> PilotAvailabilities { get; }
        DbSet<Review> Reviews { get; }
        DbSet<Message> Messages { get; }
        DbSet<CustomRequest> CustomRequests { get; }

        Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
    }
}
