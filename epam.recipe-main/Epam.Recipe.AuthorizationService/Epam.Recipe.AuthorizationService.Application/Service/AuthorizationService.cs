using Epam.Recipe.AuthorizationService.Contracts;
using Epam.Recipe.AuthorizationService.Data.Model;
using Epam.Recipe.AuthorizationService.Data.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Application.Service
{
    public class AuthorizationService:IAuthorizationService
    {
        private readonly IAuthorizationRepository _authorizationRepository;
        private readonly RegistrationValidator _validator;

        public AuthorizationService(IAuthorizationRepository authorizationRepository, RegistrationValidator validator)
        {
            _authorizationRepository = authorizationRepository;
            _validator = validator;
        }



        public async Task<(bool Success, string Message)> RegisterUserAsync(RegistrationDto registrationDto)
        {
            // Validate user registration data
            var validation = _validator.Validate(registrationDto);
            if (!validation.IsValid)
                return (false, validation.ErrorMessage);

            // Check if email already exists
            if (await _authorizationRepository.IsEmailExistsAsync(registrationDto.Email))
                return (false, "Email is already Registered.");

            // Create a new user object
            var user = new User
            {
                FirstName = registrationDto.FirstName,
                LastName = registrationDto.LastName,
                Email = registrationDto.Email,
                PasswordHash = HashPassword(registrationDto.Password),
                IsVerified = false,
                Role = "User"
            };


            // Add user to the repository asynchronously
            await _authorizationRepository.AddUserAsync(user);

            // Return success message
            return (true, "User registered successfully. Please check your email for verification.");
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }
    }
}
