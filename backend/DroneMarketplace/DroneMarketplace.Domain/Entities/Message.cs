using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DroneMarketplace.Domain.Entities
{
    public class Message : BaseEntity
    {
        [Required]
        public string SenderId { get; set; }
        [ForeignKey("SenderId")]
        public AppUser Sender { get; set; }

        [Required]
        public string ReceiverId { get; set; }
        [ForeignKey("ReceiverId")]
        public AppUser Receiver { get; set; }

        [Required]
        public string Content { get; set; }

        public bool IsRead { get; set; } = false;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;
    }
}
