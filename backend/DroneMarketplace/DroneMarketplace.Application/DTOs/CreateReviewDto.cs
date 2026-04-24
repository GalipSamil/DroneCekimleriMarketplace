using System;
using System.ComponentModel.DataAnnotations;

namespace DroneMarketplace.Application.DTOs
{
    public class CreateReviewDto
    {
        [Required]
        public Guid BookingId { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Puanlama 1 ile 5 arasında olmalıdır.")]
        public int Rating { get; set; }

        public string Comment { get; set; } = string.Empty;
    }
}
