using Epam.Recipe.Application.Services;
using Epam.Recipe.Contracts;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;
using Moq;

namespace Epam.Recipe.Tests
{
    public class RecipeUploadingServiceTests
    {
        private readonly Mock<IRecipeRepository> _mockRepository;
        private readonly RecipeService _recipeService;

        public RecipeUploadingServiceTests()
        {
            _mockRepository = new Mock<IRecipeRepository>();
            _recipeService = new RecipeService(_mockRepository.Object);
        }

        [Fact]
        public async Task PostRecipe_MapsPropertiesAndSavesCorrectly()
        {
            // Arrange
            var recipeDto = new RecipeDTO
            {
                Title = "Pancakes",
                Ingredients = "Flour, Eggs, Milk",
                CookingInstruction = "Mix ingredients and fry",
                PreparationTime = 20,
                Image = "image_url",
                UserId = 123,
                Category = "Breakfast"
            };

            // Set up the repository mock to do nothing when PostRecipe is called
            _mockRepository.Setup(repo => repo.PostRecipe(It.IsAny<RecipeModel>()))
                .Returns(Task.CompletedTask)
                .Verifiable("Repository method PostRecipe was not called with the expected parameters.");

            // Act
            await _recipeService.PostRecipe(recipeDto);

            // Assert
            _mockRepository.Verify(repo => repo.PostRecipe(
                It.Is<RecipeModel>(model =>
                    model.Title == recipeDto.Title &&
                    model.Ingredients == recipeDto.Ingredients &&
                    model.CookingInstruction == recipeDto.CookingInstruction &&
                    model.PreparationTime == recipeDto.PreparationTime &&
                    model.Image == recipeDto.Image &&
                    model.UserId == recipeDto.UserId &&
                    model.Category == recipeDto.Category
                )
            ), Times.Once);
        }
    }
}
