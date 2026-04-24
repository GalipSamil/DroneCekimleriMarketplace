using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PilotsController : ControllerBase
    {
        private readonly IPilotService _pilotService;
        private readonly ICurrentUserService _currentUserService;

        public PilotsController(IPilotService pilotService, ICurrentUserService currentUserService)
        {
            _pilotService = pilotService;
            _currentUserService = currentUserService;
        }

        [HttpPut("profile/{userId}")]
        [Authorize(Policy = "PilotOnly")]
        public async Task<ActionResult<ApiResponse<PilotManagedProfileDto>>> CreateOrUpdateProfile(string userId, [FromBody] UpdatePilotProfileDto profileDto)
        {
            var profile = await _pilotService.CreateOrUpdateProfileAsync(_currentUserService.GetRequiredActor(), userId, profileDto);
            return Ok(new ApiResponse<PilotManagedProfileDto>(profile, "Profil başarıyla güncellendi."));
        }

        [HttpGet("profile/{userId}")]
        public async Task<ActionResult<ApiResponse<PilotPublicProfileDto>>> GetPublicProfile(string userId)
        {
            var profile = await _pilotService.GetPublicProfileAsync(userId);
            if (profile == null)
            {
                return NotFound(new ApiResponse<string>("Pilot profili bulunamadı."));
            }

            return Ok(new ApiResponse<PilotPublicProfileDto>(profile));
        }

        [HttpGet("profile/{userId}/manage")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<ActionResult<ApiResponse<PilotManagedProfileDto>>> GetManagedProfile(string userId)
        {
            var profile = await _pilotService.GetManagedProfileAsync(_currentUserService.GetRequiredActor(), userId);
            if (profile == null)
            {
                return NotFound(new ApiResponse<string>("Pilot profili bulunamadı."));
            }

            return Ok(new ApiResponse<PilotManagedProfileDto>(profile));
        }

        [HttpGet("profile/me")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<ActionResult<ApiResponse<PilotManagedProfileDto>>> GetMyManagedProfile()
        {
            var actor = _currentUserService.GetRequiredActor();
            var profile = await _pilotService.GetManagedProfileAsync(actor, actor.UserId);
            if (profile == null)
            {
                return NotFound(new ApiResponse<string>("Pilot profili bulunamadı."));
            }

            return Ok(new ApiResponse<PilotManagedProfileDto>(profile));
        }

        [HttpGet("search")]
        public async Task<ActionResult<ApiResponse<IEnumerable<PilotPublicProfileDto>>>> Search(
            [FromQuery(Name = "latitude")] double? latitude,
            [FromQuery(Name = "longitude")] double? longitude,
            [FromQuery] double? radiusKm)
        {
            var pilots = await _pilotService.SearchPilotsAsync(latitude, longitude, radiusKm);
            return Ok(new ApiResponse<IEnumerable<PilotPublicProfileDto>>(pilots));
        }

        [HttpPut("{pilotId}/verify")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> VerifyPilot(Guid pilotId)
        {
            await _pilotService.VerifyPilotAsync(pilotId);
            return Ok(new ApiResponse<bool>(true, "Pilot başarıyla onaylandı."));
        }

        [HttpPut("{pilotId}/revoke-verification")]
        [Authorize(Policy = "AdminOnly")]
        public async Task<IActionResult> RevokeVerification(Guid pilotId, [FromBody] RevokePilotVerificationDto dto)
        {
            await _pilotService.RevokeVerificationAsync(pilotId, dto.Reason);
            return Ok(new ApiResponse<bool>(true, "Pilot doğrulaması iptal edildi."));
        }
    }
}
