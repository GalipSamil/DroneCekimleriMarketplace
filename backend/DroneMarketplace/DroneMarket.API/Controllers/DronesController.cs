using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DroneMarketplace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DronesController : ControllerBase
    {
        private readonly IDroneManagementService _droneService;

        public DronesController(IDroneManagementService droneService)
        {
            _droneService = droneService;
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] CreateDroneDto droneDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try
            {
                var droneId = await _droneService.AddDroneAsync(userId, droneDto);
                return CreatedAtAction(nameof(GetById), new { id = droneId }, new { id = droneId });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(ex.Message); // "Pilot profile not found"
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var drone = await _droneService.GetDroneAsync(id);
                return Ok(drone);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("pilot/{pilotUserId}")]
        public async Task<IActionResult> GetPilotDrones(string pilotUserId)
        {
            var drones = await _droneService.GetPilotDronesAsync(pilotUserId);
            return Ok(drones);
        }

        [HttpGet("available")]
        public async Task<IActionResult> GetAvailable([FromQuery] DroneType? type)
        {
            var drones = await _droneService.GetAvailableDronesAsync(type);
            return Ok(drones);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDroneDto droneDto)
        {
            // TODO: Validate ownership
            var result = await _droneService.UpdateDroneAsync(id, droneDto);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> Delete(Guid id)
        {
            // TODO: Validate ownership
            var result = await _droneService.DeleteDroneAsync(id);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpPut("{id}/availability")]
        [Authorize]
        public async Task<IActionResult> SetAvailability(Guid id, [FromBody] AvailabilityDto dto)
        {
             // TODO: Validate ownership
            var result = await _droneService.SetDroneAvailabilityAsync(id, dto.IsAvailable);
            if (!result) return NotFound();
            return Ok();
        }
    }

    public class AvailabilityDto
    {
        public bool IsAvailable { get; set; }
    }
}
