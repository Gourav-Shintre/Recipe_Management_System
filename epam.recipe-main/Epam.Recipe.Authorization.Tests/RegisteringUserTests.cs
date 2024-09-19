using Epam.Recipe.AuthorizationService.API.Controllers;
using Epam.Recipe.AuthorizationService.Application.Service;
using Epam.Recipe.AuthorizationService.Contracts;
using Microsoft.AspNetCore.Mvc;
using Moq;   
using BadRequestException = Raven.Client.Exceptions.BadRequestException;

namespace Epam.Recipe.Authorization.Tests
{
   public class RegisteringUserTests
    {
        //private readonly IAuthorizationService _authorizationService;
        private readonly AuthorizationController _controller;
        private readonly Mock<IAuthorizationService> _authorizationService = new Mock<IAuthorizationService>();

        [Fact]
        public async Task RegisterUser_ShouldReturnStatusCode201_WhenRegistrationIsValid()
        {
            // Arrange
            var dto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "Password123",
                ConfirmPassword = "Password123"
            };
            _authorizationService.Setup(x => x.RegisterUserAsync(dto))
                                 .ReturnsAsync((true, "User registered successfully."));

            // Act
            var result = await _controller.RegisterUser(dto);

            // Assert
            Assert.IsType<StatusCodeResult>(result);
            var statusCodeResult = result as StatusCodeResult;
            Assert.Equal(201, statusCodeResult.StatusCode);
        }

        [Fact]
        public async Task RegisterUser_ShouldReturnStatusCode400_WhenRegistrationIsInvalid()
        {
            // Arrange
            var dto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "Password123",
                ConfirmPassword = "Password124" // Passwords do not match
            };
            _authorizationService.Setup(x => x.RegisterUserAsync(dto))
                                 .ReturnsAsync((false, "Passwords do not match."));

            // Act
            var result = await _controller.RegisterUser(dto);

            // Assert
            Assert.IsType<ObjectResult>(result);
            var objectResult = result as ObjectResult;
            Assert.Equal(400, objectResult.StatusCode);
            Assert.Equal("Passwords do not match.", objectResult.Value);
        }
        [Fact]
        public async Task RegisterUser_ShouldReturnConflict_WhenEmailAlreadyExists()
        {
            // Arrange
            var dto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@example.com",
                Password = "Password123",
                ConfirmPassword = "Password123"
            };
            _authorizationService.Setup(x => x.RegisterUserAsync(dto));
            //.ThrowsAsync(new ConflictException("Email already exists."));

            // Act
            var result = await _controller.RegisterUser(dto);

            // Assert
            Assert.IsType<ConflictObjectResult>(result);
            var conflictResult = result as ConflictObjectResult;
            Assert.Equal("Email already exists.", conflictResult.Value);
        }
        [Fact]
        public async Task RegisterUser_ShouldReturnBadRequest_WhenServiceThrowsBadRequestException()
        {
            // Arrange
            var dto = new RegistrationDto
            {
                FirstName = "John",
                LastName = "Doe",
                Email = "invalid-email",
                Password = "Password123",
                ConfirmPassword = "Password123"
            };
            _authorizationService.Setup(x => x.RegisterUserAsync(dto))
                                 .ThrowsAsync(new BadRequestException("Invalid email address."));

            // Act
            var result = await _controller.RegisterUser(dto);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            var badRequestResult = result as BadRequestObjectResult;
            Assert.Equal("Invalid email address.", badRequestResult.Value);
        }
    }
}
