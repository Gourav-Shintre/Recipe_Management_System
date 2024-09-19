namespace Epam.Recipe.Contracts
{
    public class RecipeResponseDTO
    {
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string Ingredients { get; set; }
        public string CookingInstruction { get; set; }
        public int PreparationTime { get; set; }
        public string Image { get; set; }
        public int UserId { get; set; }
        public string Category { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}
