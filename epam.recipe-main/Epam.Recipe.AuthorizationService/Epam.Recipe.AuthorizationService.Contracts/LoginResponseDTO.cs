using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Contracts
{
    public class LoginResponseDTO
    {
        public string Status { get; set; }
        public string Token { get; set; }
    }
}
