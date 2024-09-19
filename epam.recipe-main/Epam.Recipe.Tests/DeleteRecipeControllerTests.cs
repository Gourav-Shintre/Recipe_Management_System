using Epam.Recipe.Application.Services;
using Epm.Recipe.API.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.Tests
{
    public class DeleteRecipeControllerTests
    {
        private readonly Mock<IRecipeService> _mockRecipeService;
        private readonly RecipeController _controller;

        public DeleteRecipeControllerTests()
        {
            _mockRecipeService = new Mock<IRecipeService>();
            _controller = new RecipeController(_mockRecipeService.Object);
        }

        [Fact]
        public async Task DeleteRecipe_ReturnsOk_WhenRecipeDeletedSuccessfully()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;
            _mockRecipeService.Setup(service => service.DeleteRecipe(recipeId, userId)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.DeleteRecipe(recipeId, userId);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal("Recipe deleted successfully.", okResult.Value);
        }

        [Fact]
        public async Task DeleteRecipe_ReturnsNotFound_WhenKeyNotFoundExceptionThrown()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;
            _mockRecipeService.Setup(service => service.DeleteRecipe(recipeId, userId)).ThrowsAsync(new KeyNotFoundException());

            // Act
            var result = await _controller.DeleteRecipe(recipeId, userId);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal("Recipe with ID 1 not found.", ((dynamic)notFoundResult.Value).message);
        }

        [Fact]
        public async Task DeleteRecipe_ReturnsUnauthorized_WhenUnauthorizedAccessExceptionThrown()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;
            _mockRecipeService.Setup(service => service.DeleteRecipe(recipeId, userId)).ThrowsAsync(new UnauthorizedAccessException());

            // Act
            var result = await _controller.DeleteRecipe(recipeId, userId);

            // Assert
            var unauthorizedResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal("You are not authorized to delete this recipe.", ((dynamic)unauthorizedResult.Value).message);
        }

        [Fact]
        public async Task DeleteRecipe_ReturnsServerError_WhenExceptionThrown()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;
            _mockRecipeService.Setup(service => service.DeleteRecipe(recipeId, userId)).ThrowsAsync(new Exception("Test exception"));

            // Act
            var result = await _controller.DeleteRecipe(recipeId, userId);

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result);
            Assert.Equal(500, statusCodeResult.StatusCode);
            Assert.Equal("Test exception", ((dynamic)statusCodeResult.Value).message);
        }

        [Fact]
        public async Task DeleteRecipe_ReturnsBadRequest_WhenIdIsInvalid()
        {
            // Arrange
            int invalidId = 0; // or any other invalid ID
            int userId = 123;

            // Act
            var result = await _controller.DeleteRecipe(invalidId, userId);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Invalid argument: parameter should be id", ((dynamic)badRequestResult.Value).message);
        }
    }
}
