using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.Common.Models; // Added
using DroneMarketplace.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DroneMarketplace.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IListingService _listingService;

        public ListingsController(IListingService listingService)
        {
            _listingService = listingService;
        }

        [HttpPost]
        // [Authorize] 
        public async Task<IActionResult> CreateListing([FromBody] CreateListingDto listingDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId) && Request.Headers.ContainsKey("X-User-Id"))
            {
                userId = Request.Headers["X-User-Id"];
            }
            userId ??= "test-pilot-user";
            
            // Note: GlobalExceptionMiddleware will catch exceptions
            var listingId = await _listingService.CreateListingAsync(userId, listingDto);
            return Ok(new ApiResponse<Guid>(listingId, "Listing created successfully."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetListing(Guid id)
        {
            var listing = await _listingService.GetListingAsync(id);
            if (listing == null) 
                return NotFound(new ApiResponse<string>("Listing not found."));
                
            return Ok(new ApiResponse<ListingDto>(listing));
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchListings(string? query, ServiceCategory? category)
        {
            var listings = await _listingService.SearchListingsAsync(query ?? "", category);
            return Ok(new ApiResponse<IEnumerable<ListingDto>>(listings));
        }

        [HttpGet("pilot/{userId}")]
        public async Task<IActionResult> GetPilotListings(string userId)
        {
            var listings = await _listingService.GetPilotListingsAsync(userId);
            return Ok(new ApiResponse<IEnumerable<ListingDto>>(listings));
        }

        [HttpGet("location")]
        public async Task<IActionResult> GetListingsByLocation(double latitude, double longitude, double radiusKm = 50)
        {
            var listings = await _listingService.GetListingsByLocationAsync(latitude, longitude, radiusKm);
            return Ok(new ApiResponse<IEnumerable<ListingDto>>(listings));
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateListing(Guid id, [FromBody] UpdateListingDto listingDto)
        {
            var result = await _listingService.UpdateListingAsync(id, listingDto);
            if (!result) return NotFound(new ApiResponse<string>("Listing not found."));
            
            return Ok(new ApiResponse<bool>(true, "Listing updated successfully."));
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteListing(Guid id)
        {
            var result = await _listingService.DeleteListingAsync(id);
            if (!result) return NotFound(new ApiResponse<string>("Listing not found."));

            return Ok(new ApiResponse<bool>(true, "Listing deleted successfully."));
        }
    }
}