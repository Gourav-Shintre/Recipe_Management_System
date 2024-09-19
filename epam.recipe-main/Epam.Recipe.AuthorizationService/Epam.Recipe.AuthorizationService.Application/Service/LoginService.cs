using Epam.Recipe.AuthorizationService.Contracts;
using Epam.Recipe.AuthorizationService.Data.Model;
using Epam.Recipe.AuthorizationService.Data.Repository;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Application.Service
{
    public class LoginService : ILoginService
    {
        private readonly IAuthorizationRepository _authRepository;
        private readonly IConfiguration _config;
        public LoginService(IAuthorizationRepository authRepository, IConfiguration configuration)
        {
            _authRepository = authRepository;
            _config = configuration;
        }

        public async Task<LoginResponseDTO> UserLogin(LoginDTO userLoginDTO)
        {
            User user = await _authRepository.UserLogin(userLoginDTO);
            if (user != null)
            {
                if (HashPassword(userLoginDTO.Password) == user.PasswordHash)
                {
                    string token = await GenerateJwtToken(user);
                    return new LoginResponseDTO { Status = "success", Token = token };
                }
                else
                {
                    return new LoginResponseDTO { Status = "Incorrect Password", Token = "null" };
                }
            }
            else
            {
                return new LoginResponseDTO { Status = "User not registered yet", Token = "null" };
            }
        }

        private string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(bytes);
        }

        private async Task<string> GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_config["Jwt:Secret"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                    new Claim(ClaimTypes.Name, $"{user.FirstName} {user.LastName}"),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
