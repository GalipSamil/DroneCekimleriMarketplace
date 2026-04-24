using DroneMarketplace.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace DroneMarketplace.Application.DTOs
{
    public class DroneDto
    {
        public Guid Id { get; set; }
        public Guid PilotId { get; set; }
        public string PilotName { get; set; } = string.Empty;
        
        public string Model { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public DroneType Type { get; set; }
        public string? Specifications { get; set; }
        public bool IsAvailable { get; set; }
        public decimal Weight { get; set; }
        public int MaxFlightTime { get; set; }
        public string? ImageUrl { get; set; }
        
        public DateTime CreatedAt { get; set; }
    }

    public class CreateDroneDto
    {
        [Required(ErrorMessage = "Model adı zorunludur")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Model adı 2-100 karakter arasında olmalıdır")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Marka adı zorunludur")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Marka adı 2-100 karakter arasında olmalıdır")]
        public string Brand { get; set; } = string.Empty;

        [Required(ErrorMessage = "Drone tipi zorunludur")]
        public DroneType Type { get; set; }

        [StringLength(1000, ErrorMessage = "Özellikler en fazla 1000 karakter olabilir")]
        public string? Specifications { get; set; }

        [Range(0.01, 100, ErrorMessage = "Ağırlık 0.01-100 kg arasında olmalıdır")]
        public decimal Weight { get; set; }

        [Range(1, 240, ErrorMessage = "Maksimum uçuş süresi 1-240 dakika arasında olmalıdır")]
        public int MaxFlightTime { get; set; }

        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string? ImageUrl { get; set; }
    }

    public class UpdateDroneDto
    {
        [Required(ErrorMessage = "Model adı zorunludur")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Model adı 2-100 karakter arasında olmalıdır")]
        public string Model { get; set; } = string.Empty;

        [Required(ErrorMessage = "Marka adı zorunludur")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "Marka adı 2-100 karakter arasında olmalıdır")]
        public string Brand { get; set; } = string.Empty;

        [Required(ErrorMessage = "Drone tipi zorunludur")]
        public DroneType Type { get; set; }

        [StringLength(1000, ErrorMessage = "Özellikler en fazla 1000 karakter olabilir")]
        public string? Specifications { get; set; }

        public bool IsAvailable { get; set; }

        [Range(0.01, 100, ErrorMessage = "Ağırlık 0.01-100 kg arasında olmalıdır")]
        public decimal Weight { get; set; }

        [Range(1, 240, ErrorMessage = "Maksimum uçuş süresi 1-240 dakika arasında olmalıdır")]
        public int MaxFlightTime { get; set; }

        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string? ImageUrl { get; set; }
    }
}