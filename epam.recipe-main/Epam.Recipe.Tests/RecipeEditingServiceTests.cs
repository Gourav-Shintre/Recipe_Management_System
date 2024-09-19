using Moq;
using Xunit;
using System.Threading.Tasks;
using Epam.Recipe.Contracts;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;
using Epam.Recipe.Application.Services;

namespace Epam.Recipe.Tests
{
    public class RecipeEditingServiceTests
    {
        private readonly Mock<IRecipeRepository> _mockRepository;
        private readonly RecipeService _recipeService;

        public RecipeEditingServiceTests()
        {
            _mockRepository = new Mock<IRecipeRepository>();
            _recipeService = new RecipeService(_mockRepository.Object);
        }

        [Fact]
        public async Task UpdateRecipe_IfExists_UpdatesSuccessfully()
        {
            // Arrange
            var existingRecipe = new RecipeModel { Title = "Old Title" };
            var newRecipeDto = new RecipeDTO
            {
                Title = "New Title",
                Ingredients = "New Ingredients",
                CookingInstruction = "New Instructions",
                PreparationTime = 90,
                Image = "New Image URL",
                UserId = 1,
                Category = "New Category"
            };
            _mockRepository.Setup(r => r.GetRecipeById(1)).ReturnsAsync(existingRecipe);

            // Act
            await _recipeService.UpdateRecipe(1, newRecipeDto);

            // Assert
            _mockRepository.Verify(r => r.UpdateRecipe(It.IsAny<RecipeModel>()), Times.Once);
            Assert.Equal(newRecipeDto.Title, existingRecipe.Title);
            Assert.Equal(newRecipeDto.Ingredients, existingRecipe.Ingredients);
            Assert.Equal(newRecipeDto.CookingInstruction, existingRecipe.CookingInstruction);
            Assert.Equal(newRecipeDto.PreparationTime, existingRecipe.PreparationTime);
            Assert.Equal(newRecipeDto.Image, existingRecipe.Image);
            Assert.Equal(newRecipeDto.UserId, existingRecipe.UserId);
            Assert.Equal(newRecipeDto.Category, existingRecipe.Category);
        }

        [Fact]
        public async Task UpdateRecipe_IfNotExists_ThrowsKeyNotFoundException()
        {
            // Arrange
            _mockRepository.Setup(r => r.GetRecipeById(1)).ReturnsAsync((RecipeModel)null);

            // Act & Assert
            var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() => _recipeService.UpdateRecipe(1, new RecipeDTO()));
            Assert.Equal("No recipe found with the id 1", ex.Message);
        }
    }
}