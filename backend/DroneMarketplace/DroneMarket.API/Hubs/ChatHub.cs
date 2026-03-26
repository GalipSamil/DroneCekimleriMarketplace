using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace DroneMarket.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;

        public ChatHub(IChatService chatService)
        {
            _chatService = chatService;
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var senderId = Context.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(senderId)) return;

            var messageDto = await _chatService.SendMessageAsync(senderId, createMessageDto);

            // Send to receiver
            // Note: In a real app, we would map ReceiverId to ConnectionId using a ConnectionManager service.
            // For simplicity, we will rely on SignalR Users (userId must match the ClaimTypes.NameIdentifier of the connected user)
            await Clients.User(createMessageDto.ReceiverId).SendAsync("ReceiveMessage", messageDto);
            
            // Also send back to sender so they see it instantly (or they can handle optimistically)
            await Clients.Caller.SendAsync("ReceiveMessage", messageDto);
        }

        public override async Task OnConnectedAsync()
        {
            // Here we could track online status
            await base.OnConnectedAsync();
        }
    }
}
