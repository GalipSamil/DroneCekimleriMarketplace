using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using DroneMarketplace.Infrastructure.Persistence;

namespace DroneMarketplace.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Get the API project path
            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "DroneMarketplace.API");
            if (!Directory.Exists(apiProjectPath))
            {
                apiProjectPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "DroneMarketplace.API"));
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json", optional: false)
                .AddEnvironmentVariables()
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            optionsBuilder.UseNpgsql(connectionString,
                x => x.UseNetTopologySuite());

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
