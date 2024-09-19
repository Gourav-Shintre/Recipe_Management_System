using Epam.Recipe.Application.Services;
using Epam.Recipe.Contracts;
using Epm.Recipe.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;

namespace Epam.Recipe.Tests
{
    public class RecipeControllerTests
    {
        private readonly RecipeController _controller;
        private readonly Mock<IRecipeService> _recipeServiceMock;

        public RecipeControllerTests()
        {
            _recipeServiceMock = new Mock<IRecipeService>();
            _controller = new RecipeController(_recipeServiceMock.Object);
        }

        [Fact]
        public async Task UpdateRecipe_WhenIdIsLessThanOrEqualToZero_ReturnsBadRequest()
        {
            // Arrange
            var recipeDto = new RecipeDTO { Title = "Pasta", Ingredients = "Flour", CookingInstruction = "Boil water", PreparationTime = 15, UserId = 1, Category = "Italian" };

            // Act
            var result = await _controller.UpdateRecipe(0, recipeDto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }

        [Fact]
        public async Task UpdateRecipe_WhenCalledWithValidData_ReturnsOkResult()
        {
            // Arrange
            int recipeId = 1;
            var recipeDto = new RecipeDTO { Title = "Pasta", Ingredients = "Flour", CookingInstruction = "Boil water", PreparationTime = 15, UserId = 1, Category = "Italian" };
            _recipeServiceMock.Setup(x => x.UpdateRecipe(recipeId, recipeDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.UpdateRecipe(recipeId, recipeDto);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnRecipe = Assert.IsType<RecipeDTO>(okResult.Value);
            Assert.Equal(recipeDto.Title, returnRecipe.Title);
        }

        [Fact]
        public async Task UpdateRecipe_WhenRecipeServiceThrowsArgumentException_ReturnsNotFoundResult()
        {
            // Arrange
            int recipeId = 1;
            var recipeDto = new RecipeDTO { Title = "Pasta", Ingredients = "Flour", CookingInstruction = "Boil water", PreparationTime = 15, UserId = 1, Category = "Italian" };
            _recipeServiceMock.Setup(x => x.UpdateRecipe(recipeId, recipeDto)).ThrowsAsync(new ArgumentException("Recipe not found."));

            // Act
            var result = await _controller.UpdateRecipe(recipeId, recipeDto);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("{ message = Recipe not found. }", notFoundResult.Value.ToString());
        }

        [Fact]
        public async Task UpdateRecipe_WhenUnexpectedExceptionOccurs_ReturnsStatusCode500()
        {
            // Arrange
            int recipeId = 1;
            var recipeDto = new RecipeDTO { Title = "Pasta", Ingredients = "Flour", CookingInstruction = "Boil water", PreparationTime = 15, UserId = 1, Category = "Italian" };
            _recipeServiceMock.Setup(x => x.UpdateRecipe(recipeId, recipeDto)).ThrowsAsync(new Exception("Internal server error."));

            // Act
            var result = await _controller.UpdateRecipe(recipeId, recipeDto);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }
    }
}
