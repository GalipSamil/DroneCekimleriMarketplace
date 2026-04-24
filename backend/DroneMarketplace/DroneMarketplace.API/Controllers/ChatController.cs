using DroneMarketplace.Application.Common.Models;
using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DroneMarketplace.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;
        private readonly ICurrentUserService _currentUserService;

        public ChatController(IChatService chatService, ICurrentUserService currentUserService)
        {
            _chatService = chatService;
            _currentUserService = currentUserService;
        }

        [HttpPost("messages")]
        public async Task<IActionResult> SendMessage([FromBody] CreateMessageDto createMessageDto)
        {
            var message = await _chatService.SendMessageAsync(_currentUserService.GetRequiredActor(), createMessageDto);
            return Ok(new ApiResponse<MessageDto>(message, "Mesaj başarıyla gönderildi."));
        }

        [HttpGet("conversation/{userId}")]
        public async Task<IActionResult> GetConversation(string userId)
        {
            var messages = await _chatService.GetConversationAsync(_currentUserService.GetRequiredActor(), userId);
            return Ok(new ApiResponse<IEnumerable<MessageDto>>(messages));
        }

        [HttpGet("recent")]
        public async Task<IActionResult> GetRecentMessages()
        {
            var messages = await _chatService.GetRecentMessagesAsync(_currentUserService.GetRequiredActor());
            return Ok(new ApiResponse<IEnumerable<MessageDto>>(messages));
        }

        [HttpGet("unread")]
        public async Task<IActionResult> GetUnreadCount()
        {
            var count = await _chatService.GetUnreadCountAsync(_currentUserService.GetRequiredActor());
            return Ok(new ApiResponse<int>(count));
        }

        [HttpPut("messages/{messageId}/read")]
        public async Task<IActionResult> MarkAsRead(Guid messageId)
        {
            var result = await _chatService.MarkAsReadAsync(_currentUserService.GetRequiredActor(), messageId);
            if (!result)
                return NotFound(new ApiResponse<string>("Mesaj bulunamadı."));

            return Ok(new ApiResponse<bool>(true, "Mesaj okundu olarak işaretlendi."));
        }
    }
}
