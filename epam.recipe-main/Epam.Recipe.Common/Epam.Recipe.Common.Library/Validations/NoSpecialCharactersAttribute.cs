using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace Epam.Recipe.Common.Library.Validations
{
    public class NoSpecialCharactersAttribute : ValidationAttribute
    {
        private static readonly Regex _noSpecialCharsRegex = new Regex(@"^[a-zA-Z0-9_,. ]*$", RegexOptions.Compiled);

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is string stringValue)
            {
                // Check for special characters
                if (_noSpecialCharsRegex.IsMatch(stringValue))
                {
                    return ValidationResult.Success;
                }
                else
                {
                    return new ValidationResult($"The {validationContext.DisplayName} contains special characters, which are not allowed.");
                }
            }

            return new ValidationResult("Invalid input type. The value must be a string.");
        }
    }
}
