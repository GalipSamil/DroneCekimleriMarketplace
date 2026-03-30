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
    public class ListingsController : ControllerBase
    {
        private readonly IListingService _listingService;

        public ListingsController(IListingService listingService)
        {
            _listingService = listingService;
        }

        [HttpPost]
        [Authorize(Roles = "Pilot,Admin")] 
        public async Task<IActionResult> CreateListing([FromBody] CreateListingDto listingDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));
            
            // Note: GlobalExceptionMiddleware handles InvalidOperationException and UnauthorizedAccessException logic
            var listingId = await _listingService.CreateListingAsync(userId, listingDto);
            return Ok(new ApiResponse<Guid>(listingId, "İlan başarıyla oluşturuldu."));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetListing(Guid id)
        {
            var listing = await _listingService.GetListingAsync(id);
            if (listing == null) 
                return NotFound(new ApiResponse<string>("İlan bulunamadı."));
                
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
        [Authorize(Roles = "Pilot,Admin")]
        public async Task<IActionResult> UpdateListing(Guid id, [FromBody] UpdateListingDto listingDto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));

            var isAdmin = User.IsInRole("Admin") || User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");

            var result = await _listingService.UpdateListingAsync(id, userId, isAdmin, listingDto);
            if (!result) return NotFound(new ApiResponse<string>("İlan bulunamadı."));
            
            return Ok(new ApiResponse<bool>(true, "İlan başarıyla güncellendi."));
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Pilot,Admin")]
        public async Task<IActionResult> DeleteListing(Guid id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized(new ApiResponse<string>("Oturum açmanız gerekiyor."));

            var isAdmin = User.IsInRole("Admin") || User.Claims.Any(c => c.Type == ClaimTypes.Role && c.Value == "Admin");

            var result = await _listingService.DeleteListingAsync(id, userId, isAdmin);
            if (!result) return NotFound(new ApiResponse<string>("İlan bulunamadı."));

            return Ok(new ApiResponse<bool>(true, "İlan başarıyla silindi."));
        }
    }
}