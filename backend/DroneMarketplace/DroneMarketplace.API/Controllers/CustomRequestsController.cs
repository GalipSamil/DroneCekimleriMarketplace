using System.Security.Claims;
using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CustomRequestsController : ControllerBase
    {
        private readonly ICustomRequestService _customRequestService;

        public CustomRequestsController(ICustomRequestService customRequestService)
        {
            _customRequestService = customRequestService;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateCustomRequestDto requestDto)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var created = await _customRequestService.CreateAsync(requestDto, currentUserId);
            return Ok(new ApiResponse<CustomRequestDto>(created));
        }
    }
}
