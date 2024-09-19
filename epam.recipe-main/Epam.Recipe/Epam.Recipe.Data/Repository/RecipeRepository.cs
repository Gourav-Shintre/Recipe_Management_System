using Epam.Recipe.Data.Model;
using Microsoft.EntityFrameworkCore;

namespace Epam.Recipe.Data.Repository
{

    public class RecipeRepository : IRecipeRepository
    {
        private readonly RecipeDbContext _context;
        public RecipeRepository(RecipeDbContext recipeDbContext)
        {
            _context = recipeDbContext;
        }

        public async Task PostRecipe(RecipeModel recipe)
        {
            if (recipe != null)
            {
                await _context.Recipes.AddAsync(recipe);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new Exception("Data can't be empty");
            }
        }

        public async Task<RecipeModel> GetRecipeById(int id)
        {
            return await _context.Recipes.FindAsync(id);
        }

        public async Task UpdateRecipe(RecipeModel recipe)
        {
            if (recipe != null)
            {
                _context.Recipes.Update(recipe);
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new ArgumentNullException(nameof(recipe), "Data can't be empty");
            }
        }

        public async Task<List<RecipeModel>> GetRecipes()
        {
            try
            {
                return await _context.Recipes.ToListAsync();
            }
            catch (Exception)
            {
                throw new Exception("Something went wrong while fetching data from database");
            }
        }

        public async Task DeleteRecipe(int id, int userId)
        {
            // Retrieve the recipe by ID
            var recipe = await _context.Recipes.FindAsync(id);

            if (recipe == null)
            {
                throw new KeyNotFoundException($"Recipe with ID {id} not found.");
            }

            // Check if the userId matches the owner of the recipe
            if (recipe.UserId != userId)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this recipe.");
            }

            // Remove the recipe from the context
            _context.Recipes.Remove(recipe);

            // Save changes to the database
            await _context.SaveChangesAsync();
        }

    }
}
