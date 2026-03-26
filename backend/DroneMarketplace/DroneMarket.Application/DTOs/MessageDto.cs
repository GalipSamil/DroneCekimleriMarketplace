using System;

namespace DroneMarket.Application.DTOs
{
    public class MessageDto
    {
        public Guid Id { get; set; }
        public string SenderId { get; set; }
        public string SenderName { get; set; }
        public string ReceiverId { get; set; }
        public string ReceiverName { get; set; }
        public string Content { get; set; }
        public bool IsRead { get; set; }
        public DateTime SentAt { get; set; }
    }

    public class CreateMessageDto
    {
        public string ReceiverId { get; set; }
        public string Content { get; set; }
    }
}
