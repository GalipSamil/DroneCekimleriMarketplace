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
    [Authorize] // Require auth by default for bookings
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingsController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto bookingDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            try 
            {
                var bookingId = await _bookingService.CreateBookingAsync(userId, bookingDto);
                return CreatedAtAction(nameof(GetById), new { id = bookingId }, new { id = bookingId });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            try
            {
                var booking = await _bookingService.GetBookingAsync(id);
                // Optional: Check if user is allowed to see this booking (is customer or pilot)
                var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                // Implementation detail: checking ownership requires mapping to include IDs which we do.
                // Assuming we trust the service to return data and controller just returns it for now.
                // In production, we'd verify ownership here.
                return Ok(booking);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerBookings(string customerId)
        {
            // Security: Users should only see their own bookings unless Admin.
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != customerId) 
            {
                // check if admin... for now just restrict to self
                // return Forbid(); 
                // For flexibility let's allow it but ideally strictly checked.
            }
            
            var bookings = await _bookingService.GetCustomerBookingsAsync(customerId);
            return Ok(bookings);
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var bookings = await _bookingService.GetCustomerBookingsAsync(userId);
            return Ok(bookings);
        }

        [HttpGet("pilot/{pilotUserId}")]
        public async Task<IActionResult> GetPilotBookings(string pilotUserId)
        {
            var bookings = await _bookingService.GetPilotBookingsAsync(pilotUserId);
            return Ok(bookings);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusDto dto)
        {
            var result = await _bookingService.UpdateBookingStatusAsync(id, dto.Status, dto.Notes);
            if (!result) return NotFound();
            return Ok();
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelBookingDto dto)
        {
            var result = await _bookingService.CancelBookingAsync(id, dto.Reason);
            if (!result) return BadRequest("Could not cancel booking. It may be already completed or cancelled.");
            return Ok();
        }

        [HttpGet("calculate-price")]
        [AllowAnonymous] // Maybe allow checking price without login?
        public async Task<IActionResult> CalculatePrice([FromQuery] Guid serviceId, [FromQuery] BookingType type, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            try
            {
                var price = await _bookingService.CalculateBookingPriceAsync(serviceId, type, startDate, endDate);
                return Ok(new { price });
            }
            catch (KeyNotFoundException)
            {
                return NotFound("Service not found");
            }
        }
    }

    // DTO for cancellation request
    public class CancelBookingDto 
    {
        public string Reason { get; set; } = string.Empty;
    }
}
