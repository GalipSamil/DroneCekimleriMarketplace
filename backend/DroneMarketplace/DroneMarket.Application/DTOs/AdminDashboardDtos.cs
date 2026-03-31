using System;
using System.Collections.Generic;

namespace DroneMarket.Application.DTOs
{
    public class AdminOverviewDto
    {
        public decimal TotalRevenue { get; set; }
        public int TotalUsers { get; set; }
        public int ActivePilots { get; set; }
        public int NewRequests { get; set; }
        public List<RecentActivityDto> RecentActivities { get; set; } = new();
    }

    public class RecentActivityDto
    {
        public string Text { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AdminUserDto
    {
        public string Id { get; set; } = string.Empty;
        public Guid? PilotProfileId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool Verified { get; set; }
    }

    public class AdminBookingDto
    {
        public string Id { get; set; } = string.Empty;
        public string Customer { get; set; } = string.Empty;
        public string Pilot { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public int Status { get; set; }
    }
}
