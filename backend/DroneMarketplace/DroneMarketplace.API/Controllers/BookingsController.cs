using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize] // Require auth by default for all booking endpoints
    public class BookingsController : ControllerBase
    {
        private readonly IBookingService _bookingService;
        private readonly IBookingPricingService _bookingPricingService;

        public BookingsController(IBookingService bookingService, IBookingPricingService bookingPricingService)
        {
            _bookingService = bookingService;
            _bookingPricingService = bookingPricingService;
        }

        [HttpPost]
        [Authorize(Policy = "CustomerOnly")]
        public async Task<IActionResult> Create([FromBody] CreateBookingDto bookingDto)
        {
            var bookingId = await _bookingService.CreateBookingAsync(bookingDto);
            
            return Ok(new ApiResponse<Guid>(bookingId, "Rezervasyon başarıyla oluşturuldu."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var booking = await _bookingService.GetBookingAsync(id);
            return Ok(new ApiResponse<BookingDto>(booking));
        }

        [HttpGet("customer/{customerId}")]
        public async Task<IActionResult> GetCustomerBookings(string customerId)
        {
            var bookings = await _bookingService.GetCustomerBookingsAsync(customerId);
            return Ok(new ApiResponse<IEnumerable<BookingDto>>(bookings));
        }

        [HttpGet("my-bookings")]
        public async Task<IActionResult> GetMyBookings()
        {
            var bookings = await _bookingService.GetMyBookingsAsync();
            return Ok(new ApiResponse<IEnumerable<BookingDto>>(bookings));
        }

        [HttpGet("pilot/{pilotUserId}")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> GetPilotBookings(string pilotUserId)
        {
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
        [Authorize(Policy = "CustomerOrAdmin")]
        public async Task<IActionResult> Cancel(Guid id, [FromBody] CancelBookingDto dto)
        {
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
            var price = await _bookingPricingService.CalculateBookingPriceAsync(serviceId, type, startDate, endDate);
            return Ok(new ApiResponse<decimal>(price));
        }
    }

    public class CancelBookingDto 
    {
        public string Reason { get; set; } = string.Empty;
    }
}
