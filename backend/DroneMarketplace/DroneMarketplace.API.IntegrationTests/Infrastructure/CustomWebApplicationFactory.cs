using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Application.Interfaces.Persistence;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace DroneMarketplace.API.IntegrationTests.Infrastructure;

public sealed class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("Data Source=:memory:");

    public CustomWebApplicationFactory()
    {
        _connection.Open();
    }

    public TestDataSnapshot CurrentData { get; private set; } = null!;

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");

        builder.ConfigureAppConfiguration((_, configBuilder) =>
        {
            configBuilder.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["AllowedOrigins:0"] = "https://localhost",
                ["ConnectionStrings:DefaultConnection"] = "Server=(localdb)\\mssqllocaldb;Database=ignored;Trusted_Connection=True;",
                ["JwtSettings:Issuer"] = TestAuthOptions.Issuer,
                ["JwtSettings:Audience"] = TestAuthOptions.Audience,
                ["JwtSettings:Secret"] = TestAuthOptions.Secret
            });
        });

        builder.ConfigureServices(services =>
        {
            services.RemoveAll<DbContextOptions<ApplicationDbContext>>();
            services.RemoveAll<DbContextOptions<TestApplicationDbContext>>();
            services.RemoveAll<ApplicationDbContext>();
            services.RemoveAll<IApplicationDbContext>();
            services.RemoveAll<IUnitOfWork>();
            services.AddSingleton(_connection);

            services.AddDbContext<TestApplicationDbContext>((serviceProvider, options) =>
            {
                var connection = serviceProvider.GetRequiredService<SqliteConnection>();
                options.UseSqlite(connection);
            });

            services.AddScoped<ApplicationDbContext>(serviceProvider => serviceProvider.GetRequiredService<TestApplicationDbContext>());
            services.AddScoped<IApplicationDbContext>(serviceProvider => serviceProvider.GetRequiredService<TestApplicationDbContext>());
            services.AddScoped<IUnitOfWork>(serviceProvider => serviceProvider.GetRequiredService<TestApplicationDbContext>());

            services.PostConfigure<JwtBearerOptions>(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = TestAuthOptions.Issuer,
                    ValidAudience = TestAuthOptions.Audience,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(TestAuthOptions.Secret)),
                    NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier,
                    RoleClaimType = System.Security.Claims.ClaimTypes.Role
                };
            });
        });
    }

    public async Task ResetDatabaseAsync()
    {
        await using var scope = Services.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.EnsureDeletedAsync();
        await context.Database.EnsureCreatedAsync();

        CurrentData = await TestDataSeeder.SeedAsync(scope.ServiceProvider);
    }

    public HttpClient CreateAuthenticatedClient(TestUserIdentity identity, bool includeRoleClaims = true)
    {
        var client = CreateDefaultHttpsClient();
        var roles = includeRoleClaims ? identity.Roles : Array.Empty<string>();
        var token = TestJwtTokenHelper.CreateToken(identity.UserId, identity.Email, roles);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    public HttpClient CreateAnonymousClient()
    {
        return CreateDefaultHttpsClient();
    }

    public async Task<T> ExecuteDbContextAsync<T>(Func<ApplicationDbContext, Task<T>> action)
    {
        await using var scope = Services.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        return await action(context);
    }

    public async Task ExecuteDbContextAsync(Func<ApplicationDbContext, Task> action)
    {
        await using var scope = Services.CreateAsyncScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await action(context);
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);

        if (disposing)
        {
            _connection.Dispose();
        }
    }

    private HttpClient CreateDefaultHttpsClient()
    {
        return CreateClient(new WebApplicationFactoryClientOptions
        {
            AllowAutoRedirect = false,
            BaseAddress = new Uri("https://localhost")
        });
    }
}
