using DroneMarketplace.Domain.Entities;
using DroneMarket.Application.Common.Security;
using DroneMarket.Application.Interfaces;
using DroneMarket.Application.DTOs;
using DroneMarket.Application.Interfaces.Persistence;

namespace DroneMarket.Application.Services
{
    public class ReviewService : IReviewService
    {
        private readonly IBookingRepository _bookingRepository;
        private readonly IReviewRepository _reviewRepository;
        private readonly IUnitOfWork _unitOfWork;

        public ReviewService(
            IBookingRepository bookingRepository,
            IReviewRepository reviewRepository,
            IUnitOfWork unitOfWork)
        {
            _bookingRepository = bookingRepository;
            _reviewRepository = reviewRepository;
            _unitOfWork = unitOfWork;
        }

        public async Task<ReviewDto> CreateReviewAsync(ActorContext actor, CreateReviewDto dto)
        {
            var booking = await _bookingRepository.GetByIdWithAccessGraphAsync(dto.BookingId);

            if (booking == null)
                throw new KeyNotFoundException("Sipariş bulunamadı.");

            ReviewAccessGuard.EnsureCanCreate(booking, actor);

            if (booking.Status != BookingStatus.Completed)
                throw new InvalidOperationException("Sadece tamamlanmış siparişler için değerlendirme yapılabilir.");

            var existingReview = await _reviewRepository.ExistsByBookingIdAsync(dto.BookingId);
            if (existingReview)
                throw new InvalidOperationException("Bu sipariş için zaten bir değerlendirme yapılmış.");

            var review = Review.Create(dto.BookingId, dto.Rating, dto.Comment);
            _reviewRepository.Add(review);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(review, booking);
        }

        public async Task<ReviewDto?> UpdateReviewAsync(ActorContext actor, Guid reviewId, UpdateReviewDto dto)
        {
            var review = await _reviewRepository.GetByIdWithAccessGraphAsync(reviewId);
            if (review == null)
            {
                return null;
            }

            ReviewAccessGuard.EnsureCanUpdate(review.Booking, actor);
            review.Update(dto.Rating, dto.Comment);
            await _unitOfWork.SaveChangesAsync();

            return MapToDto(review, review.Booking);
        }

        public async Task<bool> DeleteReviewAsync(ActorContext actor, Guid reviewId)
        {
            var review = await _reviewRepository.GetByIdWithAccessGraphAsync(reviewId);
            if (review == null)
            {
                return false;
            }

            ReviewAccessGuard.EnsureCanDelete(review.Booking, actor);
            _reviewRepository.Remove(review);
            await _unitOfWork.SaveChangesAsync();

            return true;
        }

        public async Task<IEnumerable<ReviewDto>> GetReviewsByPilotAsync(Guid pilotId)
        {
            var reviews = await _reviewRepository.GetByPilotIdAsync(pilotId);
            return reviews.Select(r => MapToDto(r, r.Booking));
        }

        public async Task<ReviewDto?> GetReviewByBookingAsync(ActorContext actor, Guid bookingId)
        {
            var review = await _reviewRepository.GetByBookingIdWithAccessGraphAsync(bookingId);

            if (review == null)
            {
                return null;
            }

            BookingAccessGuard.EnsureCanRead(review.Booking, actor);
            return MapToDto(review, review.Booking);
        }

        private static ReviewDto MapToDto(Review review, Booking booking)
        {
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
    }
}
