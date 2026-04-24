using System.ComponentModel.DataAnnotations;

namespace DroneMarketplace.Application.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginResponseDto
    {
        public string UserId { get; set; } = string.Empty;
        public bool IsPilot { get; set; }
        public string Token { get; set; } = string.Empty;
    }
}
