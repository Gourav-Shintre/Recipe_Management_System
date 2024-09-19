using Epam.Recipe.AuthorizationService.Contracts;
using Epam.Recipe.AuthorizationService.Data.Model;
using Epam.Recipe.AuthorizationService.Data.Repository;
using Epam.Recipe.AuthorizationService.Data;
using Microsoft.EntityFrameworkCore;

namespace Epam.Recipe.Authorization.Tests
{
    public class LoginRepositoryTests : IDisposable
    {
        private readonly AuthorizationRepository _repository;
        private readonly AuthorizationDbContext _context;

        public LoginRepositoryTests()
        {
            var options = new DbContextOptionsBuilder<AuthorizationDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new AuthorizationDbContext(options);
            _repository = new AuthorizationRepository(_context);

            // Initialize database state
            _context.Users.AddRange(
                new User { Id = 1, FirstName = "Kartikey", LastName = "Srivastava", Role = "User", IsVerified = true, PasswordHash = "6wgdqd@iwjdidw", Email = "kartikey@example.com" },
                new User { Id = 2, FirstName = "Aman", LastName = "Srivastava", Role = "User", IsVerified = true, PasswordHash = "6wgdqd@iwjdidw", Email = "kartikey2@example.com" }
            );
            _context.SaveChanges();
        }

        [Fact]
        public async Task UserLogin_ValidUser_ReturnsUser()
        {
            var loginDTO = new LoginDTO { Email = "kartikey@example.com", Password = "6wgdqd@iwjdidw" }; 

            var user = await _repository.UserLogin(loginDTO);

            Assert.NotNull(user);
            Assert.Equal("kartikey@example.com", user.Email);
        }

        [Fact]
        public async Task UserLogin_InvalidUser_ReturnsNull()
        {
            var loginDTO = new LoginDTO { Email = "nonexistentuser@example.com", Password = "wrongpassword" };

            var user = await _repository.UserLogin(loginDTO);

            Assert.Null(user);
        }

        [Fact]
        public async Task UserLogin_ThrowsException_ReturnsException()
        {
            var invalidDTO = (LoginDTO)null;

            await Assert.ThrowsAsync<Exception>(() => _repository.UserLogin(invalidDTO));
        }

        public void Dispose()
        {
            _context?.Dispose();
        }
    }
}
