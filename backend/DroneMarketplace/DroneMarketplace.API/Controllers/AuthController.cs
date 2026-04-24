using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Application.Common.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly IConfiguration _configuration;

        public AuthController(IAuthService authService, IConfiguration configuration)
        {
            _authService = authService;
            _configuration = configuration;
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
            if (!_configuration.GetValue<bool>("Features:EnablePasswordReset"))
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    new ApiResponse<string>("Password reset is temporarily disabled."));
            }

            await _authService.ForgotPasswordAsync(forgotPasswordDto.Email);

            return Ok(new ApiResponse<string?>(
                null,
                "If your email is registered, you will receive a reset link."
            ));
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetPasswordDto)
        {
            if (!_configuration.GetValue<bool>("Features:EnablePasswordReset"))
            {
                return StatusCode(StatusCodes.Status503ServiceUnavailable,
                    new ApiResponse<string>("Password reset is temporarily disabled."));
            }

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
