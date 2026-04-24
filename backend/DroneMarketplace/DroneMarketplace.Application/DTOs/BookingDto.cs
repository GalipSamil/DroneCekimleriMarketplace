using DroneMarketplace.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace DroneMarketplace.Application.DTOs
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

    public class CreateBookingDto : IValidatableObject
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
        
        public decimal Hours { get; set; }

        public int Days { get; set; }
        
        [StringLength(1000, ErrorMessage = "Müşteri notları en fazla 1000 karakter olabilir")]
        public string? CustomerNotes { get; set; }

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Hours < 0)
            {
                yield return new ValidationResult("Saat negatif olamaz", new[] { nameof(Hours) });
            }

            if (Days < 0)
            {
                yield return new ValidationResult("Gün sayısı negatif olamaz", new[] { nameof(Days) });
            }

            switch (Type)
            {
                case BookingType.Hourly when Hours <= 0 || Hours > 240:
                    yield return new ValidationResult("Saat 0-240 arasında olmalıdır", new[] { nameof(Hours) });
                    break;
                case BookingType.Daily when Days <= 0 || Days > 365:
                    yield return new ValidationResult("Gün sayısı 1-365 arasında olmalıdır", new[] { nameof(Days) });
                    break;
            }
        }
    }

    public class UpdateBookingStatusDto
    {
        [Required(ErrorMessage = "Durum zorunludur")]
        public BookingStatus Status { get; set; }

        [StringLength(1000, ErrorMessage = "Notlar en fazla 1000 karakter olabilir")]
        public string? Notes { get; set; }
    }
}
