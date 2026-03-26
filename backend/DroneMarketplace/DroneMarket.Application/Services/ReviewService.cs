using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using DroneMarketplace.Domain.Entities;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.DTOs;

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
            // İlgili rezervasyonu bul
            var booking = await _context.Bookings
                .Include(b => b.Customer)
                .Include(b => b.Listing)
                .FirstOrDefaultAsync(b => b.Id == dto.BookingId);

            if (booking == null)
            {
                throw new Exception("Sipariş bulunamadı.");
            }

            if (booking.CustomerId != customerUserId)
            {
                throw new UnauthorizedAccessException("Bu siparişi değerlendirme yetkiniz yok.");
            }

            if (booking.Status != BookingStatus.Completed)
            {
                throw new Exception("Sadece tamamlanmış siparişler için değerlendirme yapılabilir.");
            }

            // Zaten yorum yapılmış mı kontrol et
            var existingReview = await _context.Reviews.AnyAsync(r => r.BookingId == dto.BookingId);
            if (existingReview)
            {
                throw new Exception("Bu sipariş için zaten bir değerlendirme yapılmış.");
            }

            var review = new Review
            {
                Id = Guid.NewGuid(),
                BookingId = dto.BookingId,
                Rating = dto.Rating,
                Comment = dto.Comment ?? string.Empty,
                CreatedAt = DateTime.UtcNow
            };

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
                .Where(r => r.Booking.Listing.PilotId == pilotId && !r.Booking.Listing.IsDeleted) // IsDeleted check on listing
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
