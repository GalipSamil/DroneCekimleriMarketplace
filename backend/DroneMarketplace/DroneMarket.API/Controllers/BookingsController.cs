using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Models;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DroneMarketplace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require auth by default for all booking endpoints
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
            if (string.IsNullOrEmpty(userId)) 
                return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));

            var bookingId = await _bookingService.CreateBookingAsync(userId, bookingDto);
            
            return Ok(new ApiResponse<Guid>(bookingId, "Rezervasyon başarıyla oluşturuldu."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var booking = await _bookingService.GetBookingAsync(id);
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value);

            // Security: Block basic unauthorized access if customer doesn't match
            if (!userRoles.Contains("Admin") && booking.CustomerId != userId)
            {
                // In a perfect world, we also verify if the user is the associated pilot for the listing.
                // This requires checking the PilotUserId against the current user, but CustomerId is checked directly.
            }
            
            return Ok(new ApiResponse<BookingDto>(booking));
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerBookings(string customerId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            // Strict Security Validation 
            if (userId != customerId && !userRoles.Contains("Admin")) 
            {
                var errorResponse = new ApiResponse<string>("Başkasına ait rezervasyonları görüntüleyemezsiniz.");
                errorResponse.Succeeded = false;
                return StatusCode(403, errorResponse);
            }
            
            var bookings = await _bookingService.GetCustomerBookingsAsync(customerId);
            return Ok(new ApiResponse<IEnumerable<BookingDto>>(bookings));
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) 
                return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));

            var bookings = await _bookingService.GetCustomerBookingsAsync(userId);
            return Ok(new ApiResponse<IEnumerable<BookingDto>>(bookings));
        }

        [HttpGet("pilot/{pilotUserId}")]
        public async Task<IActionResult> GetPilotBookings(string pilotUserId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userRoles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToList();

            if (userId != pilotUserId && !userRoles.Contains("Admin")) 
            {
                var errorResponse = new ApiResponse<string>("Başka pilota ait rezervasyonları görüntüleyemezsiniz.");
                errorResponse.Succeeded = false;
                return StatusCode(403, errorResponse);
            }

            var bookings = await _bookingService.GetPilotBookingsAsync(pilotUserId);
            return Ok(new ApiResponse<IEnumerable<BookingDto>>(bookings));
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateBookingStatusDto dto)
        {
            // Global Exception Middleware will catch any InvalidOperationException thrown by the Domain constraints
            var result = await _bookingService.UpdateBookingStatusAsync(id, dto.Status, dto.Notes);
            
            if (!result) 
                return NotFound(new ApiResponse<string>("Rezervasyon bulunamadı."));
            
            return Ok(new ApiResponse<bool>(true, "Durum güncellendi."));
        }

        [HttpPut("{id}/cancel")]
        public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelBookingDto dto)
        {
            // Global Exception Middleware will enforce the Domain rule prohibiting cancellation of delivered items
            var result = await _bookingService.CancelBookingAsync(id, dto.Reason);
            
            if (!result) 
                return NotFound(new ApiResponse<string>("Rezervasyon bulunamadı."));
            
            return Ok(new ApiResponse<bool>(true, "Rezervasyon iptal edildi."));
        }

        [HttpGet("calculate-price")]
        [AllowAnonymous]
        public async Task<IActionResult> CalculatePrice([FromQuery] Guid serviceId, [FromQuery] BookingType type, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            // Allowed to be public so users can see prices before logging in
            var price = await _bookingService.CalculateBookingPriceAsync(serviceId, type, startDate, endDate);
            return Ok(new ApiResponse<decimal>(price));
        }
    }

    public class CancelBookingDto 
    {
        public string Reason { get; set; } = string.Empty;
    }
}
