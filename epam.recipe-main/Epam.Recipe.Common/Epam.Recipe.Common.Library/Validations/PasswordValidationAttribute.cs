using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Epam.Recipe.Common.Library.Validations
{
    public class PasswordValidationAttribute : ValidationAttribute
    {
        private const int MinimumLength = 8;

        // Regular expression to enforce password complexity and exclude spaces
        private static readonly Regex PasswordRegex = new Regex(
            @"^(?=.*[A-Z])(?=.*\d)(?=.*[\W_])(?!.*\s).{8,}$",
            RegexOptions.Compiled);

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var password = value as string;

            if (string.IsNullOrWhiteSpace(password))
            {
                return new ValidationResult("Password is required.");
            }

            // Check if the password meets the complexity requirements
            if (!PasswordRegex.IsMatch(password))
            {
                return new ValidationResult(
                    "Password must be at least 8 characters long, include at least one uppercase letter, one number, one special character, and must not contain spaces.");
            }

            return ValidationResult.Success;
        }
    }
}
