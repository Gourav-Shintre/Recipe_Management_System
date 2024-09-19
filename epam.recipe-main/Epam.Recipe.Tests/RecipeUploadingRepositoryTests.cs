using Epam.Recipe.Data;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Moq;

namespace Epam.Recipe.Tests
{
    public class RecipeUploadingRepositoryTests
    {
        private readonly Mock<RecipeDbContext> _mockContext;
        private readonly Mock<DbSet<RecipeModel>> _mockSet;
        private readonly RecipeRepository _repository;

        public RecipeUploadingRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<RecipeDbContext>().Options;
            _mockContext = new Mock<RecipeDbContext>(options);
            _mockSet = new Mock<DbSet<RecipeModel>>();
            _mockContext.Setup(m => m.Recipes).Returns(_mockSet.Object);
            _repository = new RecipeRepository(_mockContext.Object);
        }

        private void SetupMockSetWithModel(RecipeModel recipe)
        {
            _mockSet.Setup(m => m.AddAsync(recipe, default)).ReturnsAsync(default(EntityEntry<RecipeModel>));
        }

        [Fact]
        public async Task PostRecipe_AddsRecipeToDatabase()
        {
            // Arrange
            var recipe = new RecipeModel
            {
                Title = "Banana Bread",
                Ingredients = "Bananas, Flour, Sugar, Eggs",
                CookingInstruction = "Mix ingredients and bake",
                PreparationTime = 60,
                UserId = 1,
                Category = "Baked Goods"
            };
            SetupMockSetWithModel(recipe);

            // Act
            await _repository.PostRecipe(recipe);

            // Assert
            _mockSet.Verify(m => m.AddAsync(recipe, default), Times.Once);
            _mockContext.Verify(m => m.SaveChangesAsync(default), Times.Once);
        }

        [Fact]
        public async Task PostRecipe_ThrowsException_WhenCalledWith_NullRecipe()
        {
            // Arrange
            RecipeModel recipe = null;

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _repository.PostRecipe(recipe));
        }

        [Fact]
        public async Task PostRecipe_Handles_DbUpdateException()
        {
            // Arrange
            var recipe = new RecipeModel { Title = "Failed Recipe" };
            _mockSet.Setup(m => m.AddAsync(recipe, default))
                    .ThrowsAsync(new DbUpdateException());

            // Act & Assert
            await Assert.ThrowsAsync<DbUpdateException>(() => _repository.PostRecipe(recipe));
        }
    }
}
