using System.ComponentModel.DataAnnotations;

namespace Epam.Recipe.Data.Model
{
    public class RecipeModel
    {
        [Key]
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string Ingredients { get; set; }
        public string CookingInstruction { get; set; }
        public int PreparationTime { get; set; }
        public string? Image { get; set; }
        public string? Views { get; set; }
        public int IsApproved { get; set; }
        public int UserId { get; set; }
        public string Category { get; set; }
        public int RatingId { get; set; }

        public DateTime CreatedOn { get; set; }
    }
}
