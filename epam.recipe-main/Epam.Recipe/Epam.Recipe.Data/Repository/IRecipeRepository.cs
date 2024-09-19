using Epam.Recipe.Data.Model;

namespace Epam.Recipe.Data.Repository
{
    public interface IRecipeRepository
    {

        Task PostRecipe(RecipeModel recipe);
        Task<RecipeModel> GetRecipeById(int id);
        Task UpdateRecipe(RecipeModel recipe);
        Task<List<RecipeModel>> GetRecipes();
        Task DeleteRecipe(int id, int userId);

    }
}
