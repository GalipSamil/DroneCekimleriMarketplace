using DroneMarketplace.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace DroneMarket.Application.DTOs
{
    public class ListingDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public ServiceCategory Category { get; set; }
        public decimal HourlyRate { get; set; }
        public decimal DailyRate { get; set; }
        public decimal ProjectRate { get; set; }
        public string? CoverImageUrl { get; set; }
        public bool IsActive { get; set; }
        public int MaxDistance { get; set; }
        public string? RequiredEquipment { get; set; }
        public string? DeliverableFormat { get; set; }
        
        // Pilot bilgileri
        public string PilotUserId { get; set; } = string.Empty;
        public Guid PilotId { get; set; }
        public string PilotName { get; set; } = string.Empty;
        public string? PilotLocation { get; set; }
        public bool PilotIsVerified { get; set; }
        
        public DateTime CreatedAt { get; set; }
    }

    public class CreateListingDto
    {
        [Required(ErrorMessage = "Başlık zorunludur")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Başlık 5-200 karakter arasında olmalıdır")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur")]
        [StringLength(2000, MinimumLength = 20, ErrorMessage = "Açıklama 20-2000 karakter arasında olmalıdır")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Kategori zorunludur")]
        public ServiceCategory Category { get; set; }

        [Range(0, 100000, ErrorMessage = "Saatlik ücret 0-100000 arasında olmalıdır")]
        public decimal HourlyRate { get; set; }

        [Range(0, 500000, ErrorMessage = "Günlük ücret 0-500000 arasında olmalıdır")]
        public decimal DailyRate { get; set; }

        [Range(0, 5000000, ErrorMessage = "Proje ücreti 0-5000000 arasında olmalıdır")]
        public decimal ProjectRate { get; set; }

        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string? CoverImageUrl { get; set; }

        [Range(1, 1000, ErrorMessage = "Maksimum mesafe 1-1000 km arası olmalıdır")]
        public int MaxDistance { get; set; }

        [StringLength(500, ErrorMessage = "Ekipman listesi en fazla 500 karakter olabilir")]
        public string? RequiredEquipment { get; set; }

        [StringLength(500, ErrorMessage = "Teslimat formatı en fazla 500 karakter olabilir")]
        public string? DeliverableFormat { get; set; }
    }

    public class UpdateListingDto
    {
        [Required(ErrorMessage = "Başlık zorunludur")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "Başlık 5-200 karakter arasında olmalıdır")]
        public string Title { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur")]
        [StringLength(2000, MinimumLength = 20, ErrorMessage = "Açıklama 20-2000 karakter arasında olmalıdır")]
        public string Description { get; set; } = string.Empty;

        [Range(0, 100000, ErrorMessage = "Saatlik ücret 0-100000 arasında olmalıdır")]
        public decimal HourlyRate { get; set; }

        [Required(ErrorMessage = "Kategori zorunludur")]
        public ServiceCategory Category { get; set; }

        [Range(0, 500000, ErrorMessage = "Günlük ücret 0-500000 arasında olmalıdır")]
        public decimal DailyRate { get; set; }

        [Range(0, 5000000, ErrorMessage = "Proje ücreti 0-5000000 arasında olmalıdır")]
        public decimal ProjectRate { get; set; }

        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string? CoverImageUrl { get; set; }

        public bool IsActive { get; set; }

        [Range(1, 1000, ErrorMessage = "Maksimum mesafe 1-1000 km arası olmalıdır")]
        public int MaxDistance { get; set; }

        [StringLength(500, ErrorMessage = "Ekipman listesi en fazla 500 karakter olabilir")]
        public string? RequiredEquipment { get; set; }

        [StringLength(500, ErrorMessage = "Teslimat formatı en fazla 500 karakter olabilir")]
        public string? DeliverableFormat { get; set; }
    }
}