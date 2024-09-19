using Epam.Recipe.Application.Services;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;
using Moq;

namespace Epam.Recipe.Tests
{
    public class GetRecipesServiceTests
    {
        private readonly Mock<IRecipeRepository> _mockRepository;
        private readonly RecipeService _recipeService;

        public GetRecipesServiceTests()
        {
            _mockRepository = new Mock<IRecipeRepository>();
            _recipeService = new RecipeService(_mockRepository.Object);
        }

        [Fact]
        public async Task GetRecipes_ReturnsAllRecipes()
        {
            // Arrange
            var mockRecipes = new List<RecipeModel>
        {
            new RecipeModel { RecipeId = 1, Title = "Pancakes", Ingredients = "Flour, Eggs, Milk", CookingInstruction = "Mix ingredients and fry", PreparationTime = 120, Image = "image_url", UserId = 1, Category = "Breakfast"},
            new RecipeModel { RecipeId = 2, Title = "Spaghetti", Ingredients = "Pasta, Tomato Sauce", CookingInstruction = "Boil pasta, add sauce", PreparationTime = 120, Image = "image_url", UserId = 2, Category = "Lunch"}
        };

            _mockRepository.Setup(repo => repo.GetRecipes()).ReturnsAsync(mockRecipes);

            // Act
            var result = await _recipeService.GetRecipes();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("Pancakes", result[0].Title);
            Assert.Equal("Spaghetti", result[1].Title);
        }

        [Fact]
        public async Task GetRecipes_ReturnsEmptyListWhenNoRecipes()
        {
            // Arrange
            var mockRecipes = new List<RecipeModel>();
            _mockRepository.Setup(repo => repo.GetRecipes()).ReturnsAsync(mockRecipes);

            // Act
            var result = await _recipeService.GetRecipes();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetRecipes_ReturnsRecipesWithCorrectData()
        {
            // Arrange
            var mockRecipes = new List<RecipeModel>
        {
            new RecipeModel { RecipeId = 1, Title = "Pancakes", Ingredients = "Flour, Eggs, Milk", CookingInstruction = "Mix ingredients and fry", PreparationTime = 120, Image = "image_url1", UserId = 1, Category = "Breakfast"}
        };

            _mockRepository.Setup(repo => repo.GetRecipes()).ReturnsAsync(mockRecipes);

            // Act
            var result = await _recipeService.GetRecipes();

            // Assert
            Assert.NotNull(result);
            Assert.Single(result);
            var recipe = result.First();
            Assert.Equal(1, recipe.RecipeId);
            Assert.Equal("Pancakes", recipe.Title);
            Assert.Equal("Flour, Eggs, Milk", recipe.Ingredients);
            Assert.Equal("Mix ingredients and fry", recipe.CookingInstruction);
            Assert.Equal(120, recipe.PreparationTime);
            Assert.Equal("image_url1", recipe.Image);
            Assert.Equal(1, recipe.UserId);
            Assert.Equal("Breakfast", recipe.Category);
        }
    }
}
