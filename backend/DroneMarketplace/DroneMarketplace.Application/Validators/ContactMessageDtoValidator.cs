using DroneMarketplace.Application.DTOs;
using FluentValidation;

namespace DroneMarketplace.Application.Validators
{
    public class ContactMessageDtoValidator : AbstractValidator<ContactMessageDto>
    {
        public ContactMessageDtoValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Ad Soyad gereklidir.")
                .MaximumLength(100).WithMessage("Ad Soyad 100 karakteri geçemez.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email adresi gereklidir.")
                .EmailAddress().WithMessage("Geçerli bir email adresi giriniz.");

            RuleFor(x => x.Subject)
                .NotEmpty().WithMessage("Konu gereklidir.")
                .MaximumLength(150).WithMessage("Konu 150 karakteri geçemez.");

            RuleFor(x => x.Message)
                .NotEmpty().WithMessage("Mesaj gereklidir.")
                .MinimumLength(10).WithMessage("Mesaj en az 10 karakter olmalıdır.")
                .MaximumLength(4000).WithMessage("Mesaj 4000 karakteri geçemez.");
        }
    }
}
