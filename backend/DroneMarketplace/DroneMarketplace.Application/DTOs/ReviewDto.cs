using System;

namespace DroneMarketplace.Application.DTOs
{
    public class ReviewDto
    {
        public Guid Id { get; set; }
        public Guid BookingId { get; set; }
        public int Rating { get; set; }
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        
        // Frontend'de göstermek için müşteri detayları
        public string CustomerName { get; set; } = string.Empty;
        public string? CustomerProfilePictureUrl { get; set; }
    }
}
