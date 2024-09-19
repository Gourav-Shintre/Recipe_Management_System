using Epam.Recipe.AuthorizationService.Contracts;
using Epam.Recipe.AuthorizationService.Data.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Data.Repository
{
    public interface IAuthorizationRepository
    {
        Task<bool> IsEmailExistsAsync(string email);
        Task AddUserAsync(User user);
        Task<User> UserLogin(LoginDTO userLoginDTO);
    }
}
