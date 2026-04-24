using DroneMarketplace.Application.DTOs;
using DroneMarketplace.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace DroneMarketplace.API.Hubs
{
    [Authorize]
    public class ChatHub : Hub
    {
        private readonly IChatService _chatService;
        private readonly ICurrentUserService _currentUserService;

        public ChatHub(IChatService chatService, ICurrentUserService currentUserService)
        {
            _chatService = chatService;
            _currentUserService = currentUserService;
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var actor = _currentUserService.GetRequiredActor(Context.User);
            var messageDto = await _chatService.SendMessageAsync(actor, createMessageDto);

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
