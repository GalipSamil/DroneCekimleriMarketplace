using System.ComponentModel.DataAnnotations;

namespace DroneMarket.Application.DTOs
{
    public class PilotProfileDto
    {
        [StringLength(2000, ErrorMessage = "Bio en fazla 2000 karakter olabilir")]
        public string? Bio { get; set; }

        [StringLength(1000, ErrorMessage = "Ekipman listesi en fazla 1000 karakter olabilir")]
        public string? EquipmentList { get; set; }

        [StringLength(50, ErrorMessage = "SHGM lisans numarası en fazla 50 karakter olabilir")]
        public string? SHGMLicenseNumber { get; set; }

        [Range(-90, 90, ErrorMessage = "Enlem -90 ile 90 arasında olmalıdır")]
        public double Latitude { get; set; }

        [Range(-180, 180, ErrorMessage = "Boylam -180 ile 180 arasında olmalıdır")]
        public double Longitude { get; set; }

        // Read-only for clients — set by service layer from Domain entity
        public bool IsVerified { get; set; }
    }
}
