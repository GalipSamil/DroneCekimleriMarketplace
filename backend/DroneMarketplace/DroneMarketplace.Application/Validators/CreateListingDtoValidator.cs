using FluentValidation;
using DroneMarketplace.Application.DTOs;

namespace DroneMarketplace.Application.Validators
{
    public class CreateListingDtoValidator : AbstractValidator<CreateListingDto>
    {
        public CreateListingDtoValidator()
        {
            RuleFor(x => x.Title)
                .NotEmpty().WithMessage("Başlık gereklidir.")
                .MinimumLength(5).WithMessage("Başlık en az 5 karakter olmalıdır.")
                .MaximumLength(100).WithMessage("Başlık 100 karakteri geçemez.");

            RuleFor(x => x.Description)
                .NotEmpty().WithMessage("Açıklama gereklidir.")
                .MinimumLength(20).WithMessage("Açıklama en az 20 karakter olmalıdır.");

            RuleFor(x => x.HourlyRate)
                .GreaterThan(0).WithMessage("Saatlik ücret 0'dan büyük olmalıdır.")
                .LessThanOrEqualTo(x => x.DailyRate).WithMessage("Saatlik ücret, günlük ücretten fazla olamaz.");

            RuleFor(x => x.Category)
                .IsInEnum().WithMessage("Geçersiz kategori.");

            RuleFor(x => x.MaxDistance)
                .InclusiveBetween(1, 1000).WithMessage("Mesafe 1 ile 1000 km arasında olmalıdır.");
        }
    }
}
