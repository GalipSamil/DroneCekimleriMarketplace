using DroneMarket.Application.Common.Models;
using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace DroneMarket.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("conversation/{userId}")]
        public async Task<IActionResult> GetConversation(string userId)
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

            var messages = await _chatService.GetConversationAsync(currentUserId, userId);
            return Ok(new ApiResponse<IEnumerable<MessageDto>>(messages));
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentMessages()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

            var messages = await _chatService.GetRecentMessagesAsync(currentUserId);
            return Ok(new ApiResponse<IEnumerable<MessageDto>>(messages));
        }    

        [HttpGet("unread")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var currentUserId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(currentUserId)) return Unauthorized();

            var count = await _chatService.GetUnreadCountAsync(currentUserId);
            return Ok(new ApiResponse<int>(count));
        }
    }
}
