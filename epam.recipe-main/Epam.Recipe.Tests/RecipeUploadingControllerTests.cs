using Epam.Recipe.Application.Services;
using Epam.Recipe.Contracts;
using Epm.Recipe.API.Controllers;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Moq;
using System.ComponentModel.DataAnnotations;

namespace Epam.Recipe.Tests
{
    public class RecipeUploadingControllerTests
    {
        private readonly Mock<IRecipeService> _mockRecipeService;
        private readonly RecipeController _controller;
        private readonly RecipeDTO _validRecipeDto;

        public RecipeUploadingControllerTests()
        {
            _mockRecipeService = new Mock<IRecipeService>();
            _controller = new RecipeController(_mockRecipeService.Object);
            _validRecipeDto = new RecipeDTO
            {
                Title = "Chocolate Cake",
                Ingredients = "Flour, Sugar, Eggs, Cocoa",
                CookingInstruction = "Mix ingredients and bake",
                PreparationTime = 45,
                UserId = 1,
                Category = "Dessert"
            };

            var mockUrlHelper = new Mock<IUrlHelper>();
            mockUrlHelper.Setup(x => x.Action(It.IsAny<UrlActionContext>())).Returns("http://fakeurl.com");
            _controller.Url = mockUrlHelper.Object;

            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = new DefaultHttpContext()
            };
        }

        [Fact]
        public async Task PostRecipe_ValidModel_ReturnsCreatedResult()
        {
            // Arrange
            _mockRecipeService.Setup(r => r.PostRecipe(_validRecipeDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PostRecipe(_validRecipeDto);

            // Assert
            var createdResult = Assert.IsType<CreatedResult>(result);
            _mockRecipeService.Verify(s => s.PostRecipe(_validRecipeDto), Times.Once);
        }

        [Fact]
        public async Task PostRecipe_InvalidModel_ReturnsBadRequest()
        {
            // Arrange
            _controller.ModelState.AddModelError("Title", "Title is required");
            _mockRecipeService.Setup(r => r.PostRecipe(_validRecipeDto)).Returns(Task.CompletedTask);

            // Act
            var result = await _controller.PostRecipe(_validRecipeDto);

            // Assert
            Assert.IsType<BadRequestResult>(result);
            _mockRecipeService.Verify(s => s.PostRecipe(It.IsAny<RecipeDTO>()), Times.Never);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData("", false)]
        [InlineData("Valid Title", true)]
        [InlineData("I", false)]
        public void PostRecipe_ValidateTitleField(string title, bool isModelValid)
        {
            // Arrange
            _validRecipeDto.Title = title;
            ValidateField(_validRecipeDto, "Title", isModelValid);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData("", false)]
        [InlineData("Flour, Sugar, Eggs", true)]
        public void PostRecipe_ValidateIngredientsField(string ingredients, bool isModelValid)
        {
            // Arrange
            _validRecipeDto.Ingredients = ingredients;
            ValidateField(_validRecipeDto, "Ingredients", isModelValid);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData("", false)]
        [InlineData("Mix and bake", false)]
        [InlineData("Mix and bake Mix and bake", true)]
        public void PostRecipe_ValidateCookingInstructionField(string instructions, bool isModelValid)
        {
            // Arrange
            _validRecipeDto.CookingInstruction = instructions;
            ValidateField(_validRecipeDto, "CookingInstruction", isModelValid);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData(45, true)]
        [InlineData(90, true)]
        [InlineData(2, false)]
        public void PostRecipe_ValidatePreparationTimeField(int prepTime, bool isModelValid)
        {
            // Arrange
            _validRecipeDto.PreparationTime = prepTime;
            ValidateField(_validRecipeDto, "PreparationTime", isModelValid);
        }

        [Theory]
        [InlineData(0, false)] // Assuming UserId cannot be zero
        [InlineData(-1, false)] // invalid UserId
        [InlineData(1, true)] // valid UserId
        public void PostRecipe_ValidateUserIdField(int userId, bool isModelValid)
        {
            // Arrange
            _validRecipeDto.UserId = userId;
            ValidateField(_validRecipeDto, "UserId", isModelValid);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData("", false)]
        [InlineData("Dessert", false)]
        [InlineData("Veg", true)]
        public void PostRecipe_ValidateCategoryField(string category, bool isModelValid)
        {
            // Arrange
            _validRecipeDto.Category = category;
            ValidateField(_validRecipeDto, "Category", isModelValid);
        }

        private void ValidateField<T>(T model, string fieldName, bool expectedIsValid)
        {
            var validationContext = new ValidationContext(model)
            {
                MemberName = fieldName
            };
            var validationResults = new List<ValidationResult>();
            var actualIsValid = Validator.TryValidateProperty(
                typeof(T).GetProperty(fieldName).GetValue(model),
                validationContext,
                validationResults);

            // Assert
            Assert.Equal(expectedIsValid, actualIsValid);
        }
    }
}
