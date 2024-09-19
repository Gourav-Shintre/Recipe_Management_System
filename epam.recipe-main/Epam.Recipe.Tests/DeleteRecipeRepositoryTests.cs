using Epam.Recipe.Data;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.Tests
{
    public class DeleteRecipeRepositoryTests
    {
        private readonly DbContextOptions<RecipeDbContext> _dbContextOptions;

        public DeleteRecipeRepositoryTests()
        {
            _dbContextOptions = new DbContextOptionsBuilder<RecipeDbContext>()
             .UseInMemoryDatabase("TestDatabase")
             .Options;
        }

        [Fact]
        public async Task DeleteRecipe_RemovesRecipe_WhenRecipeExists()
        {
            // Arrange
            using (var context = new RecipeDbContext(_dbContextOptions))
            {
                var recipe = new RecipeModel { RecipeId = 1, UserId = 123 };
                context.Recipes.Add(recipe);
                context.SaveChanges();
            }

            using (var context = new RecipeDbContext(_dbContextOptions))
            {
                var repository = new RecipeRepository(context);

                // Act
                await repository.DeleteRecipe(1, 123);

                // Assert
                using (var assertContext = new RecipeDbContext(_dbContextOptions))
                {
                    Assert.Empty(assertContext.Recipes.ToList());
                }
            }
        }

        [Fact]
        public async Task DeleteRecipe_ThrowsKeyNotFoundException_WhenRecipeDoesNotExist()
        {
            // Arrange
            using (var context = new RecipeDbContext(_dbContextOptions))
            {
                var repository = new RecipeRepository(context);

                // Act & Assert
                await Assert.ThrowsAsync<KeyNotFoundException>(() => repository.DeleteRecipe(1, 123));
            }
        }

        [Fact]
        public async Task DeleteRecipe_ThrowsUnauthorizedAccessException_WhenUserIsNotOwner()
        {
            // Arrange
            using (var context = new RecipeDbContext(_dbContextOptions))
            {
                var recipe = new RecipeModel { RecipeId = 1, UserId = 123 };
                context.Recipes.Add(recipe);
                context.SaveChanges();
            }

            using (var context = new RecipeDbContext(_dbContextOptions))
            {
                var repository = new RecipeRepository(context);

                // Act & Assert
                await Assert.ThrowsAsync<UnauthorizedAccessException>(() => repository.DeleteRecipe(1, 456));
            }
        }
    }
}
