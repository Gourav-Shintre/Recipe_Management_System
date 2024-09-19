using System.ComponentModel.DataAnnotations;

namespace Epam.Recipe.Common.Library.Validations
{
    public class TimeFormatAttribute : ValidationAttribute
    {
        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is int num)
            {

                if (num >= 5 && num <= 4320)
                {
                    return ValidationResult.Success;
                }
                else
                {
                    return new ValidationResult($"The {validationContext.DisplayName} should be between 5mins to 4320mins.");
                }
            }
            else
            {
                return new ValidationResult($"The {validationContext.DisplayName} should be number");
            }
        }


    }
}

