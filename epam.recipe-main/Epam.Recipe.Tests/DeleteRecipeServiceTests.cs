using Epam.Recipe.Application.Services;
using Epam.Recipe.Data.Repository;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.Tests
{
    public class DeleteRecipeServiceTests
    {
        private readonly Mock<IRecipeRepository> _mockRepository;
        private readonly RecipeService _service;

        public DeleteRecipeServiceTests()
        {
            _mockRepository = new Mock<IRecipeRepository>();
            _service = new RecipeService(_mockRepository.Object);
        }

        [Fact]
        public async Task DeleteRecipe_CallsRepositoryDeleteRecipe_WhenRecipeExists()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;

            _mockRepository.Setup(repo => repo.DeleteRecipe(recipeId, userId))
                           .Returns(Task.CompletedTask);

            // Act
            await _service.DeleteRecipe(recipeId, userId);

            // Assert
            _mockRepository.Verify(repo => repo.DeleteRecipe(recipeId, userId), Times.Once);
        }

        [Fact]
        public async Task DeleteRecipe_ThrowsKeyNotFoundException_WhenRepositoryThrows()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;

            _mockRepository.Setup(repo => repo.DeleteRecipe(recipeId, userId))
                           .ThrowsAsync(new KeyNotFoundException());

            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.DeleteRecipe(recipeId, userId));
        }

        [Fact]
        public async Task DeleteRecipe_ThrowsUnauthorizedAccessException_WhenRepositoryThrows()
        {
            // Arrange
            int recipeId = 1;
            int userId = 123;

            _mockRepository.Setup(repo => repo.DeleteRecipe(recipeId, userId))
                           .ThrowsAsync(new UnauthorizedAccessException());

            // Act & Assert
            await Assert.ThrowsAsync<UnauthorizedAccessException>(() => _service.DeleteRecipe(recipeId, userId));
        }
    }
}
