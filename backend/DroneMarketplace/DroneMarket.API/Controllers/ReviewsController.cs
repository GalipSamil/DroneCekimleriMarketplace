using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
        private readonly ICurrentUserService _currentUserService;

        public ReviewsController(IReviewService reviewService, ICurrentUserService currentUserService)
        {
            _reviewService = reviewService;
            _currentUserService = currentUserService;
        }

        [HttpPost]
        [Authorize(Policy = "CustomerOnly")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> CreateReview(CreateReviewDto dto)
        {
            var result = await _reviewService.CreateReviewAsync(_currentUserService.GetRequiredActor(), dto);
            return Ok(new ApiResponse<ReviewDto>(result, "Değerlendirme başarıyla kaydedildi."));
        }

        [HttpPut("{reviewId}")]
        [Authorize(Policy = "CustomerOnly")]
        public async Task<ActionResult<ApiResponse<ReviewDto>>> UpdateReview(Guid reviewId, UpdateReviewDto dto)
        {
            var review = await _reviewService.UpdateReviewAsync(_currentUserService.GetRequiredActor(), reviewId, dto);
            if (review == null)
            {
                return NotFound(new ApiResponse<string>("Değerlendirme bulunamadı."));
            }

            return Ok(new ApiResponse<ReviewDto>(review, "Değerlendirme başarıyla güncellendi."));
        }

        [HttpDelete("{reviewId}")]
        [Authorize(Policy = "CustomerOrAdmin")]
        public async Task<ActionResult<ApiResponse<bool>>> DeleteReview(Guid reviewId)
        {
            var result = await _reviewService.DeleteReviewAsync(_currentUserService.GetRequiredActor(), reviewId);
            if (!result)
            {
                return NotFound(new ApiResponse<string>("Değerlendirme bulunamadı."));
            }

            return Ok(new ApiResponse<bool>(true, "Değerlendirme başarıyla silindi."));
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
            var review = await _reviewService.GetReviewByBookingAsync(_currentUserService.GetRequiredActor(), bookingId);
            if (review == null)
            {
                return NotFound(new ApiResponse<string>("Bu sipariş için değerlendirme bulunamadı."));
            }
            return Ok(new ApiResponse<ReviewDto>(review));
        }
    }
}
