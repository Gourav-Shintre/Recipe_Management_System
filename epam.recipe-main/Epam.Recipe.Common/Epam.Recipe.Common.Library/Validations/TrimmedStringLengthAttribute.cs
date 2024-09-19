using System.ComponentModel.DataAnnotations;

namespace Epam.Recipe.Common.Library.Validations
{
    public class TrimmedStringLengthAttribute : ValidationAttribute
    {
        private readonly int _maximumLength;
        private readonly int _minimumLength;

        public TrimmedStringLengthAttribute(int minimumLength, int maximumLength)
        {
            _maximumLength = maximumLength;
            _minimumLength = minimumLength;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is string str)
            {
                // Trim the string
                var trimmedStr = str.Trim();

                // Validate the length of the trimmed string
                if (trimmedStr.Length < _minimumLength || trimmedStr.Length > _maximumLength)
                {
                    return new ValidationResult($"The {validationContext.DisplayName} must be between {_minimumLength} and {_maximumLength} characters.");
                }
            }

            return ValidationResult.Success;
        }
    }
}
