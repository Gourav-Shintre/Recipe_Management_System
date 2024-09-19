using Epam.Recipe.Common.Library.Validations;
using System.ComponentModel.DataAnnotations;

namespace Epam.Recipe.Contracts
{
    public class RecipeDTO
    {
        [Required(ErrorMessage = "Title is required")]
        [TrimmedStringLength(3, 100)]
        [NoSpecialCharacters]
        [RegularExpression(@"^(?=.*[a-zA-Z])[a-zA-Z0-9\s_-]*$", ErrorMessage = "Title must contain alphanumeric characters and cannot consist only of numbers.")]
        public string Title { get; set; }
        [Required(ErrorMessage = "Ingredients is required")]
        [TrimmedStringLength(3, int.MaxValue, ErrorMessage = "The Ingredients must be 3 characters.")]
        [NoSpecialCharacters]
        [RegularExpression(@"^(?=.*[a-zA-Z])((\w+|\w+\s+)+)(,\s*((\w+|\w+\s+)+))+$", ErrorMessage = "Ingredients must contain alphanumeric characters and must include at least two ingredients separated by a comma.")]
        public string Ingredients { get; set; }
        [Required(ErrorMessage = "CookingInstruction is required")]
        [TrimmedStringLength(20, 2000)]
        [RegularExpression(@"^(?=.*[a-zA-Z])[a-zA-Z0-9 ,\-.:()\[\]]*$", ErrorMessage = "CookingInstruction must contain alphanumeric characters and cannot consist only of numbers.")]
        public string CookingInstruction { get; set; }
        [Required(ErrorMessage = "PreparationTime is required")]
        [TimeFormat]
        public int PreparationTime { get; set; }
        [RegularExpression(@"^https:\/\/.*", ErrorMessage = "The URL must start with https://")]
        public string Image { get; set; }
        [Required(ErrorMessage = "UserId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "UserId must be greater than 0")]
        public int UserId { get; set; }
        [Required(ErrorMessage = "Category is required")]
        [EnumNameValidation(typeof(RecipeCategory))]
        public string Category { get; set; }

    }
}


