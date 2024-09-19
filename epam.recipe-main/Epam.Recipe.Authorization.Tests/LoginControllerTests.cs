using Epam.Recipe.AuthorizationService.API.Controllers;
using Epam.Recipe.AuthorizationService.Application.Service;
using Epam.Recipe.AuthorizationService.Contracts;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.Authorization.Tests
{
    public class LoginControllerTests
    {
        private readonly LoginController _controller;
        private readonly Mock<ILoginService> _mockUserService;
        private LoginDTO _validLoginDto;

        public LoginControllerTests()
        {
            _mockUserService = new Mock<ILoginService>();
            _controller = new LoginController(_mockUserService.Object);
            _validLoginDto = new LoginDTO
            {
                Email = "kartikey@gmail.com",
                Password = "Qwerty@123"
            };
        }

        [Fact]
        public async Task UserLogin_ReturnsOk_WhenLoginIsSuccessful()
        {
            // Arrange
            var userLoginDto = new LoginDTO {
                Email = "kartikey@gmail.com",
                Password = "Qwerty@123"
            };
            var loginResponse = new LoginResponseDTO { Status = "success" };
            _mockUserService.Setup(service => service.UserLogin(userLoginDto))
                            .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.UserLogin(userLoginDto);

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result);
            Assert.Equal(loginResponse, actionResult.Value);
        }

        [Fact]
        public async Task UserLogin_ReturnsUnauthorized_WhenPasswordIsIncorrect()
        {
            // Arrange
            var userLoginDto = new LoginDTO { /* Initialize with valid data */ };
            var loginResponse = new LoginResponseDTO { Status = "Incorrect Password" };
            _mockUserService.Setup(service => service.UserLogin(userLoginDto))
                            .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.UserLogin(userLoginDto);

            // Assert
            var actionResult = Assert.IsType<UnauthorizedObjectResult>(result);
            Assert.Equal(loginResponse, actionResult.Value);
        }

        [Fact]
        public async Task UserLogin_ReturnsNotFound_WhenUserIsNotRegistered()
        {
            // Arrange
            var userLoginDto = new LoginDTO { /* Initialize with valid data */ };
            var loginResponse = new LoginResponseDTO { Status = "User not registered yet" };
            _mockUserService.Setup(service => service.UserLogin(userLoginDto))
                            .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.UserLogin(userLoginDto);

            // Assert
            var actionResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(loginResponse, actionResult.Value);
        }

        [Fact]
        public async Task UserLogin_ReturnsBadRequest_WhenStatusIsUnknown()
        {
            // Arrange
            var userLoginDto = new LoginDTO { /* Initialize with valid data */ };
            var loginResponse = new LoginResponseDTO { Status = "Unknown Error" };
            _mockUserService.Setup(service => service.UserLogin(userLoginDto))
                            .ReturnsAsync(loginResponse);

            // Act
            var result = await _controller.UserLogin(userLoginDto);

            // Assert
            var actionResult = Assert.IsType<BadRequestResult>(result);
        }

        [Fact]
        public async Task UserLogin_ReturnsBadRequest_WhenModelStateIsInvalid()
        {
            // Arrange
            _controller.ModelState.AddModelError("Error", "Invalid model state");
            var userLoginDto = new LoginDTO { Email = "12@gmail.com", Password = "Qwerty@123" };

            // Act
            var result = await _controller.UserLogin(userLoginDto);

            // Assert
            var actionResult = Assert.IsType<BadRequestResult>(result);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData("", false)]
        [InlineData("Email", false)]
        [InlineData("kartikey@gmail.com", true)]
        [InlineData("Kart..@gmail.com", false)]
        [InlineData("a@b.com", false)]
        [InlineData("kartikey@1.com", false)]
        public void UserLogin_ValidateEmailField(string email, bool isModelValid)
        {
            // Arrange
            _validLoginDto.Email = email;
            ValidateField(_validLoginDto, "Email", isModelValid);
        }

        [Theory]
        [InlineData(null, false)]
        [InlineData("", false)]
        [InlineData("Qwerty123", false)]
        [InlineData("Qwerty@123", true)]
        [InlineData("qwerty@123", false)]
        public void UserLogin_ValidatePasswordField(string password, bool isModelValid)
        {
            // Arrange
            _validLoginDto.Password = password;
            ValidateField(_validLoginDto, "Password", isModelValid);
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
