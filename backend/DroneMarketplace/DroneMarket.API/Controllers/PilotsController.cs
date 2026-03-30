using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DroneMarketplace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PilotsController : ControllerBase
    {
        private readonly IPilotService _pilotService;

        public PilotsController(IPilotService pilotService)
        {
            _pilotService = pilotService;
        }

        [HttpPost("profile")]
        [Authorize(Roles = "Pilot,Admin")]
        public async Task<IActionResult> CreateOrUpdateProfile([FromBody] PilotProfileDto profileDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));

            await _pilotService.CreateOrUpdateProfileAsync(userId, profileDto);
            return Ok(new ApiResponse<bool>(true, "Profil başarıyla güncellendi."));
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(string userId)
        {
            var profile = await _pilotService.GetProfileAsync(userId);
            if (profile == null)
                return NotFound(new ApiResponse<string>("Pilot profili bulunamadı."));

            return Ok(new ApiResponse<PilotProfileDto>(profile));
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(double lat, double lon, double radiusKm)
        {
            var pilots = await _pilotService.SearchPilotsAsync(lat, lon, radiusKm);
            return Ok(new ApiResponse<IEnumerable<PilotProfileDto>>(pilots));
        }

        [HttpPut("{pilotId}/verify")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> VerifyPilot(Guid pilotId)
        {
            // Domain will throw InvalidOperationException if SHGM license is missing
            await _pilotService.VerifyPilotAsync(pilotId);
            return Ok(new ApiResponse<bool>(true, "Pilot başarıyla onaylandı."));
        }

        [HttpPut("{pilotId}/revoke-verification")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RevokeVerification(Guid pilotId, [FromBody] RevokeVerificationDto dto)
        {
            await _pilotService.RevokeVerificationAsync(pilotId, dto.Reason);
            return Ok(new ApiResponse<bool>(true, "Pilot doğrulaması iptal edildi."));
        }
    }

    public class RevokeVerificationDto
    {
        public string Reason { get; set; } = string.Empty;
    }
}
