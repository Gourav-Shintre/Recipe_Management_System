using Epam.Recipe.Contracts;

namespace Epam.Recipe.Application.Services
{
    public interface IRecipeService
    {
        Task PostRecipe(RecipeDTO recipe);
        Task UpdateRecipe(int id, RecipeDTO recipe);

        Task<List<RecipeResponseDTO>> GetRecipes();
        Task DeleteRecipe(int id, int userId);
    }
}
