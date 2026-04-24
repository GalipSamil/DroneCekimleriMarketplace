using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using DroneMarketplace.Domain.Entities;


using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Application.Interfaces.Persistence;

namespace DroneMarketplace.Infrastructure.Persistence
{
    public class ApplicationDbContext : IdentityDbContext<AppUser>, IApplicationDbContext, IUnitOfWork
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Pilot> Pilots { get; set; }
        public DbSet<Listing> Listings { get; set; }
        public DbSet<Drone> Drones { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<PilotAvailability> PilotAvailabilities { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<CustomRequest> CustomRequests { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.HasPostgresExtension("postgis");

            builder.Entity<AppUser>()
                .HasOne(u =>u.PilotProfile)
                .WithOne(p => p.AppUser)
                .HasForeignKey<Pilot>(p =>  p.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);


            // Yeni Entity Configurations
            builder.Entity<Listing>(entity =>
            {
                entity.HasOne(ds => ds.Pilot)
                    .WithMany(p => p.Listings)
                    .HasForeignKey(ds => ds.PilotId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(ds => ds.HourlyRate).HasColumnType("decimal(18,2)");
                entity.Property(ds => ds.DailyRate).HasColumnType("decimal(18,2)");
                entity.Property(ds => ds.ProjectRate).HasColumnType("decimal(18,2)");
            });

            builder.Entity<Drone>(entity =>
            {
                entity.HasOne(d => d.Pilot)
                    .WithMany(p => p.Drones)
                    .HasForeignKey(d => d.PilotId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.Property(d => d.Weight).HasColumnType("decimal(8,2)");
            });

            builder.Entity<Booking>(entity =>
            {
                entity.HasOne(b => b.Listing)
                    .WithMany(ds => ds.Bookings)
                    .HasForeignKey(b => b.ListingId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(b => b.Customer)
                    .WithMany()
                    .HasForeignKey(b => b.CustomerId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(b => b.TotalPrice).HasColumnType("decimal(18,2)");
                entity.Property(b => b.Hours).HasColumnType("decimal(8,2)");
            });

            builder.Entity<PilotAvailability>(entity =>
            {
                entity.HasOne(pa => pa.Pilot)
                    .WithMany(p => p.Availabilities)
                    .HasForeignKey(pa => pa.PilotId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Review>(entity =>
            {
                entity.HasOne(r => r.Booking)
                    .WithOne(b => b.Review)
                    .HasForeignKey<Review>(r => r.BookingId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            builder.Entity<Message>(entity =>
            {
                entity.HasOne(m => m.Sender)
                    .WithMany()
                    .HasForeignKey(m => m.SenderId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.HasOne(m => m.Receiver)
                    .WithMany()
                    .HasForeignKey(m => m.ReceiverId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            builder.Entity<CustomRequest>(entity =>
            {
                entity.Property(x => x.Location).HasMaxLength(200);
                entity.Property(x => x.Budget).HasMaxLength(100);
                entity.Property(x => x.Details).HasMaxLength(4000);
                entity.Property(x => x.ContactPhone).HasMaxLength(50);

                entity.HasOne(x => x.CustomerUser)
                    .WithMany()
                    .HasForeignKey(x => x.CustomerUserId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            builder.Entity<Pilot>()
                .Property(p => p.Location)
                .HasColumnType("geography (point)");



        }

    }
}
