using Epam.Recipe.Data;
using Epam.Recipe.Data.Model;
using Epam.Recipe.Data.Repository;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace Epam.Recipe.Tests
{
    public class GetRecipesRepositoryTests
    {
        private readonly Mock<RecipeDbContext> _mockContext;
        private readonly RecipeRepository _repository;
        private readonly Mock<DbSet<RecipeModel>> _mockSet;

        public GetRecipesRepositoryTests()
        {
            _mockContext = new Mock<RecipeDbContext>(new DbContextOptions<RecipeDbContext>());
            _mockSet = new Mock<DbSet<RecipeModel>>();

            // Setting up DbSet to use as an IQueryable
            _mockSet.As<IQueryable<RecipeModel>>().Setup(m => m.Provider).Returns(GetTestData().Provider);
            _mockSet.As<IQueryable<RecipeModel>>().Setup(m => m.Expression).Returns(GetTestData().Expression);
            _mockSet.As<IQueryable<RecipeModel>>().Setup(m => m.ElementType).Returns(GetTestData().ElementType);
            _mockSet.As<IQueryable<RecipeModel>>().Setup(m => m.GetEnumerator()).Returns(GetTestData().GetEnumerator());

            // Configure the async enumerable
            _mockSet.As<IAsyncEnumerable<RecipeModel>>()
                .Setup(m => m.GetAsyncEnumerator(It.IsAny<CancellationToken>()))
                .Returns(new TestAsyncEnumerator<RecipeModel>(GetTestData().GetEnumerator()));

            // Setup DbContext to return the mocked DbSet
            _mockContext.Setup(c => c.Recipes).Returns(_mockSet.Object);

            _repository = new RecipeRepository(_mockContext.Object);
        }

        private IQueryable<RecipeModel> GetTestData()
        {
            return new List<RecipeModel>
            {
                new RecipeModel
                {
                    RecipeId = 1,
                    Title = "Chocolate Cake",
                    Ingredients = "2 cups sugar, 1 3/4 cups flour, 3/4 cup cocoa powder, 1.5 tsp baking powder, 1.5 tsp baking soda, 1 tsp salt, 2 eggs, 1 cup milk, 1/2 cup vegetable oil, 2 tsp vanilla extract, 1 cup boiling water",
                    CookingInstruction = "Mix dry ingredients, add eggs, milk, oil, and vanilla. Mix in boiling water last. Bake at 350 degrees F for 30-35 minutes.",
                    PreparationTime = 120,
                    Image = "chocolate_cake.jpg",
                    Views = "150",
                    IsApproved = 1,
                    UserId = 101,
                    Category = "Veg",
                    RatingId = 5
                },
                new RecipeModel
                {
                    RecipeId = 2,
                    Title = "Grilled Salmon",
                    Ingredients = "1 salmon fillet, 2 tbsp olive oil, 1 tbsp lemon juice, 1 tsp dill, salt, pepper",
                    CookingInstruction = "Preheat grill. Mix oil, lemon, and spices, brush on fish. Grill each side 7 min.",
                    PreparationTime = 20,
                    Image = "grilled_salmon.jpg",
                    Views = "300",
                    IsApproved = 1,
                    UserId = 102,
                    Category = "NonVeg",
                    RatingId = 5
                }
            }.AsQueryable();
        }

        [Fact]
        public async Task GetRecipes_SuccessfullyFetchesRecipes()
        {
            // Act
            var result = await _repository.GetRecipes();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Equal("Chocolate Cake", result[0].Title);
            Assert.Equal("Grilled Salmon", result[1].Title);
        }

        [Fact]
        public async Task GetRecipes_ThrowsException()
        {
            // Arrange
            _mockContext.Setup(c => c.Recipes).Throws(new Exception("Something went wrong while fetching data from database"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() => _repository.GetRecipes());
        }
        public class TestAsyncEnumerator<T> : IAsyncEnumerator<T>
        {
            private readonly IEnumerator<T> _innerEnumerator;

            public TestAsyncEnumerator(IEnumerator<T> innerEnumerator)
            {
                _innerEnumerator = innerEnumerator;
            }

            public T Current => _innerEnumerator.Current;

            public ValueTask DisposeAsync() => new ValueTask();

            public async ValueTask<bool> MoveNextAsync()
            {
                return await Task.FromResult(_innerEnumerator.MoveNext());
            }
        }
    }
}
