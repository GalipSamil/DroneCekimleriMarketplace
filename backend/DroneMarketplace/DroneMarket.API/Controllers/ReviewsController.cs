using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DroneMarket.Application.Services;
using DroneMarket.Application.DTOs;

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
        [Authorize]
        public async Task<ActionResult<ReviewDto>> CreateReview(CreateReviewDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized();
            }

            try
            {
                var result = await _reviewService.CreateReviewAsync(userId, dto);
                return Ok(result);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Forbid(ex.Message);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("pilot/{pilotId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetReviewsByPilot(Guid pilotId)
        {
            var reviews = await _reviewService.GetReviewsByPilotAsync(pilotId);
            return Ok(reviews);
        }

        [HttpGet("booking/{bookingId}")]
        [Authorize]
        public async Task<ActionResult<ReviewDto>> GetReviewByBooking(Guid bookingId)
        {
            var review = await _reviewService.GetReviewByBookingAsync(bookingId);
            if (review == null)
            {
                return NotFound();
            }
            return Ok(review);
        }
    }
}
