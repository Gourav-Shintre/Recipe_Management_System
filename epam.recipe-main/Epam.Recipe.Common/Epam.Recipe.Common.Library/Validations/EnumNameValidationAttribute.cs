using System.ComponentModel.DataAnnotations;

namespace Epam.Recipe.Common.Library.Validations
{
    public class EnumNameValidationAttribute : ValidationAttribute
    {
        private readonly Type _enumType;

        public EnumNameValidationAttribute(Type enumType)
        {
            if (!enumType.IsEnum)
            {
                throw new ArgumentException("Type must be an enum.", nameof(enumType));
            }

            _enumType = enumType;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            if (value is string stringValue)
            {
                var enumNames = Enum.GetNames(_enumType);
                if (enumNames.Contains(stringValue))
                {
                    return ValidationResult.Success;
                }
                else
                {
                    return new ValidationResult($"Invalid Category. Please choose from Veg, NonVeg, or Beverages.");
                }
            }

            return new ValidationResult("Invalid input type. The value must be a string.");
        }
    }
}