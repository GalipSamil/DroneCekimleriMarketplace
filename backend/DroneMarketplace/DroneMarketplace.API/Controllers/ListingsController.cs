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
    public class ListingsController : ControllerBase
    {
        private readonly IListingService _listingService;

        public ListingsController(IListingService listingService)
        {
            _listingService = listingService;
        }

        [HttpPost]
        [Authorize(Policy = "PilotOnly")]
        public async Task<IActionResult> CreateListing([FromBody] CreateListingDto listingDto)
        {
            var listingId = await _listingService.CreateListingAsync(listingDto);
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

        [HttpGet("{id}/manage")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> GetManagedListing(Guid id)
        {
            var listing = await _listingService.GetManagedListingAsync(id);
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

        [HttpGet("my-listings")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> GetMyListings()
        {
            var listings = await _listingService.GetMyListingsAsync();
            return Ok(new ApiResponse<IEnumerable<ListingDto>>(listings));
        }

        [HttpGet("location")]
        public async Task<IActionResult> GetListingsByLocation(double latitude, double longitude, double radiusKm = 50)
        {
            var listings = await _listingService.GetListingsByLocationAsync(latitude, longitude, radiusKm);
            return Ok(new ApiResponse<IEnumerable<ListingDto>>(listings));
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> UpdateListing(Guid id, [FromBody] UpdateListingDto listingDto)
        {
            var result = await _listingService.UpdateListingAsync(id, listingDto);
            if (!result) return NotFound(new ApiResponse<string>("İlan bulunamadı."));
            
            return Ok(new ApiResponse<bool>(true, "İlan başarıyla güncellendi."));
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> DeleteListing(Guid id)
        {
            var result = await _listingService.DeleteListingAsync(id);
            if (!result) return NotFound(new ApiResponse<string>("İlan bulunamadı."));

            return Ok(new ApiResponse<bool>(true, "İlan başarıyla silindi."));
        }

        [HttpPut("{id}/activation")]
        [Authorize(Policy = "PilotOrAdmin")]
        public async Task<IActionResult> SetActivation(Guid id, [FromBody] SetListingActivationDto dto)
        {
            var result = await _listingService.SetListingActivationAsync(id, dto.IsActive);
            if (!result) return NotFound(new ApiResponse<string>("İlan bulunamadı."));

            return Ok(new ApiResponse<bool>(true, dto.IsActive ? "İlan aktif edildi." : "İlan pasife alındı."));
        }
    }
}
