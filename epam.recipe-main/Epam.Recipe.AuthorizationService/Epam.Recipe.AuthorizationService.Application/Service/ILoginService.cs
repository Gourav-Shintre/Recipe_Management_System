using Epam.Recipe.AuthorizationService.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Application.Service
{
    public interface ILoginService
    {
        Task<LoginResponseDTO> UserLogin(LoginDTO userLoginDTO);
    }
}
