using Microsoft.EntityFrameworkCore;
using DroneMarketplace.Domain.Entities;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.DTOs;
using System.Security.Cryptography.X509Certificates;

namespace DroneMarket.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IApplicationDbContext _context;

        public ReviewService(IApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<ReviewDto> CreateReviewAsync(string customerUserId, CreateReviewDto dto)
        {
            // Business rule: Check if booking exists
            var booking = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Listing)
                .FirstOrDefaultAsync(b => b.Id == dto.BookingId);

            if (booking == null)
                throw new KeyNotFoundException("Sipariş bulunamadı.");

            // Business rule: Authorization check
            if (booking.CustomerId != customerUserId)
                throw new UnauthorizedAccessException("Bu siparişi değerlendirme yetkiniz yok.");

            // Business rule: Status valid states check
            if (booking.Status != BookingStatus.Completed)
                throw new InvalidOperationException("Sadece tamamlanmış siparişler için değerlendirme yapılabilir.");

            // Business rule: Unique constraint check
            var existingReview = await _context.Reviews.AnyAsync(r => r.BookingId == dto.BookingId);
            if (existingReview)
                throw new InvalidOperationException("Bu sipariş için zaten bir değerlendirme yapılmış.");

            // Domain creates the logic
            var review = Review.Create(dto.BookingId, dto.Rating, dto.Comment);

            await _context.Reviews.AddAsync(review);
            await _context.SaveChangesAsync();

            return new ReviewDto
            {
                Id = review.Id,
                BookingId = review.BookingId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt,
                CustomerName = booking.Customer.FullName,
                CustomerProfilePictureUrl = booking.Customer.ProfilePictureUrl
            };
        }

        public async Task<IEnumerable<ReviewDto>> GetReviewsByPilotAsync(Guid pilotId)
        {
            var reviews = await _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Customer)
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Listing)
                .Where(r => r.Booking.Listing.PilotId == pilotId && !r.Booking.Listing.IsDeleted)
                .OrderByDescending(r => r.CreatedAt)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    BookingId = r.BookingId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    CreatedAt = r.CreatedAt,
                    CustomerName = r.Booking.Customer.FullName,
                    CustomerProfilePictureUrl = r.Booking.Customer.ProfilePictureUrl
                })
                .ToListAsync();

            return reviews;
        }

        public async Task<ReviewDto?> GetReviewByBookingAsync(Guid bookingId)
        {
            var r = await _context.Reviews
                .Include(r => r.Booking)
                    .ThenInclude(b => b.Customer)
                .FirstOrDefaultAsync(r => r.BookingId == bookingId);

            if (r == null) return null;

            return new ReviewDto
            {
                Id = r.Id,
                BookingId = r.BookingId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt,
                CustomerName = r.Booking.Customer.FullName,
                CustomerProfilePictureUrl = r.Booking.Customer.ProfilePictureUrl
            };
        }
    }
}
