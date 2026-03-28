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
        public string Text { get; set; }
        public string Time { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AdminUserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public string Status { get; set; }
        public bool Verified { get; set; }
    }

    public class AdminBookingDto
    {
        public string Id { get; set; }
        public string Customer { get; set; }
        public string Pilot { get; set; }
        public string Date { get; set; }
        public decimal Amount { get; set; }
        public int Status { get; set; }
    }
}
