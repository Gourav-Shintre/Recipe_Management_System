using Epam.Recipe.Contracts;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;

namespace Epam.Recipe.Application.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _recipeRepository;

        public RecipeService(IRecipeRepository repository)
        {
            _recipeRepository = repository;
        }

        public async Task PostRecipe(RecipeDTO recipe)
        {
            RecipeModel recipeModel = new RecipeModel
            {
                Title = recipe.Title,
                Ingredients = recipe.Ingredients,
                CookingInstruction = recipe.CookingInstruction,
                PreparationTime = recipe.PreparationTime,
                Image = recipe.Image,
                UserId = recipe.UserId,
                Category = recipe.Category,
                CreatedOn = DateTime.UtcNow
            };
            await _recipeRepository.PostRecipe(recipeModel);
        }

        public async Task UpdateRecipe(int id, RecipeDTO recipe)
        {
            var recipeModel = await _recipeRepository.GetRecipeById(id);
            if (recipeModel == null)
            {
                throw new KeyNotFoundException($"No recipe found with the id {id}");
            }

            recipeModel.Title = recipe.Title;
            recipeModel.Ingredients = recipe.Ingredients;
            recipeModel.CookingInstruction = recipe.CookingInstruction;
            recipeModel.PreparationTime = recipe.PreparationTime;
            recipeModel.Image = recipe.Image;
            recipeModel.UserId = recipe.UserId;
            recipeModel.Category = recipe.Category;

            await _recipeRepository.UpdateRecipe(recipeModel);
        }

        public async Task<List<RecipeResponseDTO>> GetRecipes()
        {
            List<RecipeResponseDTO> allRecipes = new List<RecipeResponseDTO>();
            var recipes = await _recipeRepository.GetRecipes();
            foreach (RecipeModel recipe in recipes)
            {
                RecipeResponseDTO dto = new RecipeResponseDTO
                {
                    RecipeId = recipe.RecipeId,
                    Title = recipe.Title,
                    Ingredients = recipe.Ingredients,
                    CookingInstruction = recipe.CookingInstruction,
                    PreparationTime = recipe.PreparationTime,
                    Image = recipe.Image,
                    UserId = recipe.UserId,
                    Category = recipe.Category,
                    CreatedOn = recipe.CreatedOn
                };
                allRecipes.Add(dto);
            }
            return allRecipes;
        }

        public async Task DeleteRecipe(int id, int userId)
        {
            try
            {
                await _recipeRepository.DeleteRecipe(id, userId);
            }
            catch (KeyNotFoundException)
            {
                throw new KeyNotFoundException($"Recipe with ID {id} not found.");
            }
            catch (UnauthorizedAccessException)
            {
                throw new UnauthorizedAccessException("You are not authorized to delete this recipe.");
            }
            catch (Exception ex)
            {
                throw new Exception("An error occurred while deleting the recipe.", ex);
            }
        }
    }
}
