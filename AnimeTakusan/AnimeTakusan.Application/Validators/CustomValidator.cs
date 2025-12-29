using System;
using FluentValidation;

namespace AnimeTakusan.Application.Validators;

public class CustomValidator<T> : AbstractValidator<T>
{
    protected override void RaiseValidationException(
        ValidationContext<T> context,
        FluentValidation.Results.ValidationResult result)
    {
        var errors = result.Errors
            .Select(e => $"{e.PropertyName}: {e.ErrorMessage}")
            .ToList();

        throw new ValidationException(string.Join("\n ", errors));
    }
}
