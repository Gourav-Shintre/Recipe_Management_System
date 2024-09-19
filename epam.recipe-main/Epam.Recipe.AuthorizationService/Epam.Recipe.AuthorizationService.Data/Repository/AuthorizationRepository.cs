using Epam.Recipe.AuthorizationService.Contracts;
using Epam.Recipe.AuthorizationService.Data.Model;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Data.Repository
{
    public class AuthorizationRepository:IAuthorizationRepository
    {
        private readonly AuthorizationDbContext _context;

        public AuthorizationRepository(AuthorizationDbContext context)
        {
            _context = context;
        }

        public async Task<bool> IsEmailExistsAsync(string email)
        {
            return await _context.Users.AnyAsync(u => u.Email == email);
        }

        public async Task AddUserAsync(User user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User> UserLogin(LoginDTO userLoginDTO)
        {
            try
            {
                return await _context.Users.FirstOrDefaultAsync(user => user.Email == userLoginDTO.Email);
            }
            catch (Exception)
            {
                throw new Exception("Something went wrong");
            }
        }
    }
}
