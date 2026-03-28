using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DroneMarket.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly IApplicationDbContext _context;
        private readonly UserManager<AppUser> _userManager;

        public AdminService(IApplicationDbContext context, UserManager<AppUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        public async Task<AdminOverviewDto> GetOverviewAsync()
        {
            var totalUsers = await _userManager.Users.CountAsync();
            var activePilots = await _context.Pilots.CountAsync(p => p.IsVerified);
            var totalRevenue = await _context.Bookings
                .Where(b => b.Status == BookingStatus.Completed)
                .SumAsync(b => b.TotalPrice);

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
            
            return users.Select(user => {
                var pilotProfile = pilots.FirstOrDefault(p => p.AppUserId == user.Id);
                var isPilot = pilotProfile != null;
                
                return new AdminUserDto
                {
                    Id = user.Id,
                    Name = user.FullName ?? user.Email,
                    Email = user.Email,
                    Role = isPilot ? "Pilot" : "Müşteri",
                    Status = isPilot ? (pilotProfile.IsVerified ? "Doğrulandı" : "Onay Bekliyor") : "Aktif",
                    Verified = isPilot ? pilotProfile.IsVerified : true
                };
            }).ToList();
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
                Date = b.StartDate.ToString("yyyy-MM-dd"),
                Amount = b.TotalPrice,
                Status = (int)b.Status
            }).ToList();
        }

        public async Task<bool> ApprovePilotAsync(string userId)
        {
            var pilot = await _context.Pilots.FirstOrDefaultAsync(p => p.AppUserId == userId);
            if (pilot == null) return false;

            pilot.IsVerified = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteUserAsync(string userId)
        {
            // First check if the user is the super-admin
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            var result = await _userManager.DeleteAsync(user);
            return result.Succeeded;
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
