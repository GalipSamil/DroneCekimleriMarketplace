using DroneMarket.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using DroneMarketplace.Domain.Entities;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Services;
using FluentValidation;
using FluentValidation.AspNetCore;
using DroneMarket.API.Middleware;
using DroneMarket.API.Hubs;
using DroneMarket.API.Services;
using DroneMarket.Application.Common.Security;
using DroneMarket.Infrastructure.Services;
using DroneMarket.Application.Interfaces.Persistence;
using DroneMarket.Infrastructure.Persistence.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? Array.Empty<string>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        o => o.UseNetTopologySuite());
});

builder.Services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddScoped<IUnitOfWork>(provider => provider.GetRequiredService<ApplicationDbContext>());
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<ICurrentUserService, HttpCurrentUserService>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IListingRepository, ListingRepository>();
builder.Services.AddScoped<IDroneRepository, DroneRepository>();
builder.Services.AddScoped<IPilotRepository, PilotRepository>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();

builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 6;
    
    // User settings
    options.User.RequireUniqueEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT Authentication
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings.GetValue<string>("Secret") ?? throw new InvalidOperationException("JWT Secret is not configured");
var issuer = jwtSettings.GetValue<string>("Issuer");
var audience = jwtSettings.GetValue<string>("Audience");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = issuer,
        ValidAudience = audience,
        IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(secretKey)),
        NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier,
        RoleClaimType = System.Security.Claims.ClaimTypes.Role
    };
    
    // Support SignalR
    options.Events = new Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chathub"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole(SystemRoles.Admin));
    options.AddPolicy("CustomerOnly", policy => policy.RequireRole(SystemRoles.Customer));
    options.AddPolicy("PilotOnly", policy => policy.RequireRole(SystemRoles.Pilot));
    options.AddPolicy("PilotOrAdmin", policy => policy.RequireRole(SystemRoles.Pilot, SystemRoles.Admin));
    options.AddPolicy("CustomerOrAdmin", policy => policy.RequireRole(SystemRoles.Customer, SystemRoles.Admin));
});

// Authentication & User Services
builder.Services.AddScoped<IJwtProvider, JwtProvider>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();
builder.Services.AddScoped<IAdminUserManagementService, AdminUserManagementService>();
builder.Services.AddScoped<IPilotService, PilotService>();
builder.Services.AddScoped<IEmailService, MockEmailService>();

// Drone Services
builder.Services.AddScoped<IListingService, ListingService>();
builder.Services.AddScoped<IDroneManagementService, DroneManagementService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddScoped<IBookingPricingService, BookingPricingService>();
builder.Services.AddScoped<IChatService, ChatService>();
builder.Services.AddScoped<IReviewService, ReviewService>();

builder.Services.AddSignalR();

// Validation
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<DroneMarket.Application.Validators.CreateListingDtoValidator>();

var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();

var runMigrationsOnStartup = builder.Configuration.GetValue(
    "StartupTasks:RunMigrationsOnStartup",
    false);

var runSeedOnStartup = builder.Configuration.GetValue(
    "StartupTasks:RunSeedOnStartup",
    false);

if (runMigrationsOnStartup)
{
    try
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await context.Database.MigrateAsync();
        logger.LogInformation("Database migrations completed on startup.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while running database migrations on startup.");
        throw;
    }
}

if (runSeedOnStartup)
{
    try
    {
        await DroneMarket.Infrastructure.Data.SeedData.InitializeAsync(app.Services, app.Environment);
        logger.LogInformation("Seed data initialization completed on startup.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while seeding data on startup.");
        throw;
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use CORS
app.UseCors("AllowFrontend");

app.UseMiddleware<GlobalExceptionMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/chathub");

app.Run();

public partial class Program;
