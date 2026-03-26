using System.ComponentModel.DataAnnotations;

namespace DroneMarket.Application.DTOs
{
    public class RegisterDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; }

        [Required]
        public string FullName { get; set; }
        
        public bool IsPilot { get; set; } = false;
    }
}
