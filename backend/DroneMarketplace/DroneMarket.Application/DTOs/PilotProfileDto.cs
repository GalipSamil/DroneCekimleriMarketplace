using System.ComponentModel.DataAnnotations;

namespace DroneMarket.Application.DTOs
{
    public class UpdatePilotProfileDto
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
    }

    public class PilotPublicProfileDto
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Bio { get; set; }
        public string? EquipmentList { get; set; }
        public bool IsVerified { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }

    public class PilotManagedProfileDto : PilotPublicProfileDto
    {
        public string? SHGMLicenseNumber { get; set; }
    }

    public class RevokePilotVerificationDto
    {
        [Required(ErrorMessage = "İptal sebebi zorunludur.")]
        public string Reason { get; set; } = string.Empty;
    }
}
