using DroneMarketplace.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace DroneMarket.Application.DTOs
{
    public class BookingDto
    {
        public Guid Id { get; set; }
        public Guid ListingId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string CustomerId { get; set; } = string.Empty;
        public string CustomerName { get; set; } = string.Empty;
        public string PilotName { get; set; } = string.Empty;
        
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public BookingType Type { get; set; }
        
        public string Location { get; set; } = string.Empty;
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        
        public decimal TotalPrice { get; set; }
        public decimal Hours { get; set; }
        public int Days { get; set; }
        
        public BookingStatus Status { get; set; }
        public DateTime BookingDate { get; set; }
        
        public string? CustomerNotes { get; set; }
        public string? PilotNotes { get; set; }
        public bool HasReview { get; set; }
    }

    public class CreateBookingDto
    {
        [Required(ErrorMessage = "İlan ID zorunludur")]
        public Guid ListingId { get; set; }

        [Required(ErrorMessage = "Başlangıç tarihi zorunludur")]
        public DateTime StartDate { get; set; }

        [Required(ErrorMessage = "Bitiş tarihi zorunludur")]
        public DateTime EndDate { get; set; }

        [Required(ErrorMessage = "Rezervasyon tipi zorunludur")]
        public BookingType Type { get; set; }
        
        [Required(ErrorMessage = "Lokasyon zorunludur")]
        [StringLength(500, ErrorMessage = "Lokasyon en fazla 500 karakter olabilir")]
        public string Location { get; set; } = string.Empty;

        [Range(-90, 90, ErrorMessage = "Enlem -90 ile 90 arasında olmalıdır")]
        public double Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Boylam -180 ile 180 arasında olmalıdır")]
        public double Longitude { get; set; }
        
        [Range(0, 240, ErrorMessage = "Saat 0-240 arasında olmalıdır")]
        public decimal Hours { get; set; }

        [Range(0, 365, ErrorMessage = "Gün sayısı 0-365 arasında olmalıdır")]
        public int Days { get; set; }
        
        [StringLength(1000, ErrorMessage = "Müşteri notları en fazla 1000 karakter olabilir")]
        public string? CustomerNotes { get; set; }
    }

    public class UpdateBookingStatusDto
    {
        [Required(ErrorMessage = "Durum zorunludur")]
        public BookingStatus Status { get; set; }

        [StringLength(1000, ErrorMessage = "Notlar en fazla 1000 karakter olabilir")]
        public string? Notes { get; set; }
    }
}