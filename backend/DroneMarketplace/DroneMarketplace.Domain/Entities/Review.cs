using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DroneMarketplace.Domain.Entities
{
    public class Review : BaseEntity
    {
        public Guid BookingId { get; set; }
        public Booking Booking { get; set; }

        public int Rating { get; set; }
        public string Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
