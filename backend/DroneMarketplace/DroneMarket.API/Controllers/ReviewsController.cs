using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DroneMarket.Application.Services;
using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Models;

namespace DroneMarket.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReviewsController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewsController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        [Authorize(Roles = "Customer,Admin")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> CreateReview(CreateReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));
            }

            // Exceptions (InvalidOperationException, UnauthorizedAccessException) are handled by GlobalExceptionMiddleware
            var result = await _reviewService.CreateReviewAsync(userId, dto);
            return Ok(new ApiResponse<ReviewDto>(result, "Değerlendirme başarıyla kaydedildi."));
        }

        [HttpGet("pilot/{pilotId}")]
        public async Task<ActionResult<ApiResponse<IEnumerable<ReviewDto>>>> GetReviewsByPilot(Guid pilotId)
        {
            var reviews = await _reviewService.GetReviewsByPilotAsync(pilotId);
            return Ok(new ApiResponse<IEnumerable<ReviewDto>>(reviews));
        }

        [HttpGet("booking/{bookingId}")]
        [Authorize]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> GetReviewByBooking(Guid bookingId)
        {
            var review = await _reviewService.GetReviewByBookingAsync(bookingId);
            if (review == null)
            {
                return NotFound(new ApiResponse<string>("Bu sipariş için değerlendirme bulunamadı."));
            }
            return Ok(new ApiResponse<ReviewDto>(review));
        }
    }
}
