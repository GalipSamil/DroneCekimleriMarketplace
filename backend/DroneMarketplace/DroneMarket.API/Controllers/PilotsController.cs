using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
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
        [Authorize]
        public async Task<IActionResult> CreateOrUpdateProfile([FromBody] PilotProfileDto profileDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            
            await _pilotService.CreateOrUpdateProfileAsync(userId, profileDto);
            return Ok();
        }

        [HttpGet("profile/{userId}")]
        public async Task<IActionResult> GetProfile(string userId)
        {
            var profile = await _pilotService.GetProfileAsync(userId);
            if (profile == null) return NotFound();
            return Ok(profile);
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search(double lat, double lon, double radiusKm)
        {
            var pilots = await _pilotService.SearchPilotsAsync(lat, lon, radiusKm);
            return Ok(pilots);
        }
    }
}
