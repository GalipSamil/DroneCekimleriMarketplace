using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Models;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
        {
            var userId = await _authService.RegisterAsync(registerDto);
            return Ok(new ApiResponse<string>(userId, "Registration successful."));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                var errorResponse = new ApiResponse<string>("Invalid email or password.");
                errorResponse.Succeeded = false;
                return Unauthorized(errorResponse);
            }
            return Ok(new ApiResponse<LoginResponseDto>(result));
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto forgotPasswordDto)
        {
            await _authService.ForgotPasswordAsync(forgotPasswordDto.Email);
            return Ok(new ApiResponse<string>(null!, "If your email is registered, you will receive a reset link."));
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var result = await _authService.ResetPasswordAsync(resetPasswordDto.Email, resetPasswordDto.Token, resetPasswordDto.NewPassword);
            if (result)
            {
                return Ok(new ApiResponse<string>(null!, "Password has been reset successfully."));
            }
            
            var errorResponse = new ApiResponse<string>("Invalid token or email.");
            errorResponse.Succeeded = false;
            return BadRequest(errorResponse);
        }
    }
}
