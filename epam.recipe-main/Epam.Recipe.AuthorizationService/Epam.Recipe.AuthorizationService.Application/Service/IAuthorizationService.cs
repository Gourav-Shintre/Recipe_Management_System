using Epam.Recipe.AuthorizationService.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Application.Service
{
    public interface IAuthorizationService
    {
        Task<(bool Success, string Message)> RegisterUserAsync(RegistrationDto userDto);
    }
}
