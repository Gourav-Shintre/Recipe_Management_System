using Epam.Recipe.Application.Services;
using Epam.Recipe.Contracts;
using Epm.Recipe.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Epam.Recipe.Tests
{
    public class GetRecipesControllerTests
    {
        private readonly Mock<IRecipeService> mockRecipeService;
        private readonly RecipeController controller;

        public GetRecipesControllerTests()
        {
            mockRecipeService = new Mock<IRecipeService>();
            controller = new RecipeController(mockRecipeService.Object);
        }

        [Fact]
        public async Task GetRecipes_WithNonEmptyRecipes_ShouldReturnOkObjectResultWithRecipes()
        {
            // Arrange
            var fakeRecipes = new List<RecipeResponseDTO> { new RecipeResponseDTO { Title = "Recipe1", RecipeId = 1, Ingredients = "abc,xyz", PreparationTime = 610, CookingInstruction = "qwertyuiopasdfghjkl", Category = "Veg", Image = "https://example.com", UserId = 1 } };
            mockRecipeService.Setup(service => service.GetRecipes()).ReturnsAsync(fakeRecipes);

            // Act
            var result = await controller.GetRecipes();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedRecipes = Assert.IsType<List<RecipeResponseDTO>>(okResult.Value);
            Assert.Equal(fakeRecipes.Count, returnedRecipes.Count);
            mockRecipeService.Verify(service => service.GetRecipes());
        }

        [Fact]
        public async Task GetRecipes_WithEmptyRecipes_ShouldReturnNoContentResult()
        {
            // Arrange
            var emptyRecipes = new List<RecipeResponseDTO>();
            mockRecipeService.Setup(service => service.GetRecipes()).ReturnsAsync(emptyRecipes);

            // Act
            var result = await controller.GetRecipes();

            // Assert
            Assert.IsType<NoContentResult>(result.Result);
            mockRecipeService.Verify(service => service.GetRecipes(), Times.Once);
        }

        [Fact]
        public async Task GetRecipes_WithNullRecipes_ShouldReturnInternalServerError()
        {
            // Arrange
            mockRecipeService.Setup(service => service.GetRecipes()).Returns(Task.FromResult<List<RecipeResponseDTO>>(null));

            // Act
            var result = await controller.GetRecipes();

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusCodeResult.StatusCode);
            mockRecipeService.Verify(service => service.GetRecipes(), Times.Once);
        }
    }
}
