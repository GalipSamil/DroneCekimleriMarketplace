using System;

namespace DroneMarketplace.Domain.Entities
{
    public class Review : BaseEntity
    {
        public Guid BookingId { get; private set; }
        public Booking Booking { get; private set; } = default!;

        public int Rating { get; private set; }
        public string Comment { get; private set; } = string.Empty;

        // For EF Core
        protected Review() { }

        public static Review Create(Guid bookingId, int rating, string comment)
        {
            ValidateRating(rating);

            return new Review
            {
                BookingId = bookingId,
                Rating = rating,
                Comment = comment?.Trim() ?? string.Empty
            };
        }

        public void Update(int rating, string? comment)
        {
            ValidateRating(rating);

            Rating = rating;
            Comment = comment?.Trim() ?? string.Empty;
            Touch();
        }

        private static void ValidateRating(int rating)
        {
            if (rating < 1 || rating > 5)
                throw new ArgumentOutOfRangeException(nameof(rating), "Değerlendirme puanı 1 ile 5 arasında olmalıdır.");
        }
    }
}
