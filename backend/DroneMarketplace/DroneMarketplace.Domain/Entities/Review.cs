using System;

namespace DroneMarketplace.Domain.Entities
{
    public class Review : BaseEntity
    {
        public Guid BookingId { get; private set; }
        public Booking Booking { get; private set; }

        public int Rating { get; private set; }
        public string Comment { get; private set; }
        public DateTime CreatedAt { get; private set; } 

        // For EF Core
        protected Review() { }

        public static Review Create(Guid bookingId, int rating, string comment)
        {
            if (rating < 1 || rating > 5)
                throw new ArgumentOutOfRangeException(nameof(rating), "Değerlendirme puanı 1 ile 5 arasında olmalıdır.");

            return new Review
            {
                Id = Guid.NewGuid(),
                BookingId = bookingId,
                Rating = rating,
                Comment = comment ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };
        }
    }
}
