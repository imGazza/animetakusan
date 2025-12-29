using AnimeTakusan.Application.DTOs.Authentication.Requests;
using FluentValidation;

namespace AnimeTakusan.Application.Validators.Authentication;

public class LoginRequestValidator : CustomValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Invalid email format.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(12).WithMessage("Password must be at least 12 characters long.");
    }
}
