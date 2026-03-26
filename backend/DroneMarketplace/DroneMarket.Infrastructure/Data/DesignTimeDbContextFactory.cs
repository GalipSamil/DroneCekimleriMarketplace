using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using DroneMarket.Infrastructure.Persistence;

namespace DroneMarket.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            // Get the API project path
            var apiProjectPath = Path.Combine(Directory.GetCurrentDirectory(), "..", "DroneMarket.API");
            if (!Directory.Exists(apiProjectPath))
            {
                apiProjectPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "..", "DroneMarket.API"));
            }

            var configuration = new ConfigurationBuilder()
                .SetBasePath(apiProjectPath)
                .AddJsonFile("appsettings.json", optional: false)
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
            var connectionString = configuration.GetConnectionString("DefaultConnection");
            
            optionsBuilder.UseSqlServer(connectionString, 
                x => x.UseNetTopologySuite());

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
