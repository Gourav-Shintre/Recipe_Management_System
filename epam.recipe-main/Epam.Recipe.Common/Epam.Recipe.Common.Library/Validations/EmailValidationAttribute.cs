using System;
using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Epam.Recipe.Common.Library.Validations
{
    public class EmailValidationAttribute : ValidationAttribute
    {
        private static readonly Regex EmailRegex = new Regex(@"^(?<localPart>[^\s@]+)@(?<domain>[^\s@]+)\.com$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        private static readonly Regex DomainWithAlphaRegex = new Regex(@"^(?!\d+$)[a-zA-Z\d]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        private static readonly Regex LocalPartRegex = new Regex(@"^(?!\d+$)(?!.*[._-]{2})[a-zA-Z0-9._-]+$", RegexOptions.Compiled | RegexOptions.IgnoreCase);

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var email = value as string;

            if (string.IsNullOrWhiteSpace(email))
            {
                return new ValidationResult("Email is required.");
            }

            var match = EmailRegex.Match(email);

            if (match.Success)
            {
                var localPart = match.Groups["localPart"].Value;
                var domain = match.Groups["domain"].Value;

                if (localPart.Length + domain.Length < 7)
                {
                    return new ValidationResult("Email length should be atleast 12");
                }
                
                if (!LocalPartRegex.IsMatch(localPart))
                {
                    return new ValidationResult("Invalid Email Format. Use something like johndoe@gmail.com");
                }

                if (!DomainWithAlphaRegex.IsMatch(domain))
                {
                    return new ValidationResult("Invalid Email Format. Use something like johndoe@gmail.com");
                }

                return ValidationResult.Success;
            }

            return new ValidationResult("The email must be in the format 'johndoe@gmail.com' and cannot contain spaces.");
        }
    }
}
