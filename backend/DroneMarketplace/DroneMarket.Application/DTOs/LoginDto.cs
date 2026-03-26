using System.ComponentModel.DataAnnotations;

namespace DroneMarket.Application.DTOs
{
    public class LoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class LoginResponseDto
    {
        public string UserId { get; set; }
        public bool IsPilot { get; set; }
        public string Token { get; set; }
    }
}
