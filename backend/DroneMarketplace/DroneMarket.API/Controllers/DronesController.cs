using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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
        [Authorize(Policy = "PilotOnly")]
        public async Task<IActionResult> Create([FromBody] CreateDroneDto droneDto)
        {
            var droneId = await _droneService.AddDroneAsync(droneDto);
            return CreatedAtAction(nameof(GetById), new { id = droneId }, new { id = droneId });
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
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> Update(Guid id, [FromBody] UpdateDroneDto droneDto)
        {
            var result = await _droneService.UpdateDroneAsync(id, droneDto);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var result = await _droneService.DeleteDroneAsync(id);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpPut("{id}/availability")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> SetAvailability(Guid id, [FromBody] AvailabilityDto dto)
        {
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
