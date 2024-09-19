using Epam.Recipe.AuthorizationService.Application.Service;
using Epam.Recipe.AuthorizationService.Contracts;
using Epam.Recipe.AuthorizationService.Data.Model;
using Epam.Recipe.AuthorizationService.Data.Repository;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.Authorization.Tests
{
    public class LoginServiceTests
    {
        private readonly Mock<IAuthorizationRepository> _mockUserRepository;
        private readonly Mock<IConfiguration> _mockConfig;
        private readonly LoginService _loginService;

        public LoginServiceTests()
        {
            _mockUserRepository = new Mock<IAuthorizationRepository>();
            _mockConfig = new Mock<IConfiguration>();

            // Mock JWT Secret Key
            _mockConfig.SetupGet(config => config["Jwt:Secret"]).Returns("U29tZSBsb25nIHN0cmluZyB0aGF0IGlzIGF0IGxlYXN0IG5vbmUgY29tcGxleCBzYXl0ZWQ=");

            _loginService = new LoginService(_mockUserRepository.Object, _mockConfig.Object);
        }

        [Fact]
        public async Task UserLogin_ShouldReturnSuccess_WhenUserIsValid()
        {
            // Arrange
            var userLoginDTO = new LoginDTO { Email = "test@example.com", Password = "password123" };
            var user = new User
            {
                Id = 29,
                FirstName = "John",
                LastName = "Doe",
                Email = "test@example.com",
                PasswordHash = HashPassword("password123"), // Simulate hashed password
                Role = "User"
            };

            _mockUserRepository.Setup(repo => repo.UserLogin(userLoginDTO)).ReturnsAsync(user);

            // Act
            var result = await _loginService.UserLogin(userLoginDTO);

            // Assert
            Assert.Equal("success", result.Status);
            Assert.NotNull(result.Token);
        }

        [Fact]
        public async Task UserLogin_ShouldReturnIncorrectPassword_WhenPasswordIsInvalid()
        {
            // Arrange
            var userLoginDTO = new LoginDTO { Email = "test@example.com", Password = "wrongpassword" };
            var user = new User
            {
                Id = 12,
                FirstName = "John",
                LastName = "Doe",
                Email = "test@example.com",
                PasswordHash = HashPassword("password123"), // Simulate hashed password
                Role = "User"
            };

            _mockUserRepository.Setup(repo => repo.UserLogin(userLoginDTO)).ReturnsAsync(user);

            // Act
            var result = await _loginService.UserLogin(userLoginDTO);

            // Assert
            Assert.Equal("Incorrect Password", result.Status);
            Assert.Equal("null", result.Token);
        }

        [Fact]
        public async Task UserLogin_ShouldReturnUserNotRegistered_WhenUserDoesNotExist()
        {
            // Arrange
            var userLoginDTO = new LoginDTO { Email = "test@example.com", Password = "password123" };

            _mockUserRepository.Setup(repo => repo.UserLogin(userLoginDTO)).ReturnsAsync((User)null);

            // Act
            var result = await _loginService.UserLogin(userLoginDTO);

            // Assert
            Assert.Equal("User not registered yet", result.Status);
            Assert.Equal("null", result.Token);
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
