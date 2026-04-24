using System.ComponentModel.DataAnnotations;

namespace DroneMarketplace.Application.DTOs
{
    public class CreateCustomRequestDto
    {
        [Range(0, int.MaxValue, ErrorMessage = "Kategori zorunludur.")]
        public int Category { get; set; }

        [Required(ErrorMessage = "Konum zorunludur.")]
        [StringLength(200, ErrorMessage = "Konum en fazla 200 karakter olabilir.")]
        public string Location { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tarih zorunludur.")]
        public DateTime Date { get; set; }

        [StringLength(100, ErrorMessage = "Butce en fazla 100 karakter olabilir.")]
        public string? Budget { get; set; }

        [Required(ErrorMessage = "Detay alani zorunludur.")]
        [StringLength(4000, ErrorMessage = "Detay alani en fazla 4000 karakter olabilir.")]
        public string Details { get; set; } = string.Empty;

        [Required(ErrorMessage = "Iletisim numarasi zorunludur.")]
        [StringLength(50, ErrorMessage = "Iletisim numarasi en fazla 50 karakter olabilir.")]
        public string ContactPhone { get; set; } = string.Empty;
    }

    public class CustomRequestDto
    {
        public string Id { get; set; } = string.Empty;
        public int Category { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string? Budget { get; set; }
        public string Details { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string CreatedAt { get; set; } = string.Empty;
        public string? CustomerUserId { get; set; }
    }
}
