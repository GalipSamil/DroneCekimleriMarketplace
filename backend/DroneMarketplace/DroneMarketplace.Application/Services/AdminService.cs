using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DroneMarketplace.Application.Common.Time;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DroneMarketplace.Application.Services
{
    public class AdminDashboardService : IAdminDashboardService
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public AdminDashboardService(IApplicationDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<AdminOverviewDto> GetOverviewAsync()
        {
            var totalUsers = await _userManager.Users.CountAsync();
            var activePilots = await _context.Pilots.CountAsync(p => p.IsVerified);
            var completedBookingAmounts = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Completed)
                .Select(b => b.TotalPrice)
                .ToListAsync();
            var totalRevenue = completedBookingAmounts.Sum();

            var newRequests = await _context.Bookings.CountAsync(b => b.Status == BookingStatus.Pending);

            var recentBookings = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Listing)
                .OrderByDescending(b => b.CreatedAt)
                .Take(5)
                .ToListAsync();

            var activities = recentBookings.Select(b => new RecentActivityDto
            {
                Text = $"{b.Customer?.FullName ?? "Bilinmeyen Müşteri"}, {b.Listing?.Title ?? "Bilinmeyen İlan"} için rezervasyon yaptı.",
                Time = GetTimeAgo(b.CreatedAt),
                CreatedAt = b.CreatedAt
            }).ToList();

            return new AdminOverviewDto
            {
                TotalRevenue = totalRevenue,
                TotalUsers = totalUsers,
                ActivePilots = activePilots,
                NewRequests = newRequests,
                RecentActivities = activities
            };
        }

        public async Task<List<AdminUserDto>> GetUsersAsync()
        {
            var users = await _userManager.Users.ToListAsync();
            var pilots = await _context.Pilots.ToListAsync();
            
            var result = new List<AdminUserDto>();
            foreach (var user in users)
            {
                var pilotProfile = pilots.FirstOrDefault(p => p.AppUserId == user.Id);
                var roles = await _userManager.GetRolesAsync(user);
                var isAdmin = roles.Contains("Admin");
                var isPilot = roles.Contains("Pilot") || pilotProfile != null;
                var pilotStatus = pilotProfile?.IsVerified == true
                    ? "Doğrulandı"
                    : !string.IsNullOrWhiteSpace(pilotProfile?.VerificationRejectionReason)
                        ? "Reddedildi"
                        : "Onay Bekliyor";

                result.Add(new AdminUserDto
                {
                    Id = user.Id,
                    PilotProfileId = pilotProfile?.Id,
                    Name = !string.IsNullOrWhiteSpace(user.FullName)
                        ? user.FullName
                        : user.Email ?? user.UserName ?? string.Empty,
                    Email = user.Email ?? string.Empty,
                    Role = isAdmin ? "Admin" : (isPilot ? "Pilot" : "Müşteri"),
                    Status = isAdmin ? "Sistem Yöneticisi" : (isPilot ? pilotStatus : "Aktif"),
                    Verified = isAdmin || (isPilot ? pilotProfile?.IsVerified == true : true)
                });
            }

            return result;
        }

        public async Task<List<AdminBookingDto>> GetBookingsAsync()
        {
            var bookings = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Listing)
                    .ThenInclude(l => l.Pilot)
                        .ThenInclude(p => p.AppUser)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            return bookings.Select(b => new AdminBookingDto
            {
                Id = b.Id.ToString(),
                Customer = b.Customer?.FullName ?? "Bilinmeyen Müşteri",
                Pilot = b.Listing?.Pilot?.AppUser?.FullName ?? "Bilinmeyen Pilot",
                Date = MarketplaceDateTime.NormalizeOutgoing(b.StartDate).ToString("yyyy-MM-dd"),
                Amount = b.TotalPrice,
                Status = (int)b.Status
            }).ToList();
        }

        public async Task<List<CustomRequestDto>> GetCustomRequestsAsync()
        {
            var requests = await _context.CustomRequests
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return requests.Select(x => new CustomRequestDto
            {
                Id = x.Id.ToString(),
                Category = x.Category,
                Location = x.Location,
                Date = x.RequestedDate.ToString("yyyy-MM-dd"),
                Budget = x.Budget,
                Details = x.Details,
                ContactPhone = x.ContactPhone,
                CreatedAt = x.CreatedAt.ToString("O"),
                CustomerUserId = x.CustomerUserId
            }).ToList();
        }

        private string GetTimeAgo(DateTime dateTime)
        {
            var timeSpan = DateTime.UtcNow - dateTime;
            if (timeSpan <= TimeSpan.FromMinutes(60))
                return Math.Max(1, timeSpan.Minutes) + " dk önce";
            if (timeSpan <= TimeSpan.FromHours(24))
                return timeSpan.Hours + " saat önce";
            return timeSpan.Days + " gün önce";
        }
    }
}
