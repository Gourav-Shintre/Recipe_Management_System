using Epam.Recipe.Common.Library.Validations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Contracts
{
    public class LoginDTO
    {
        [EmailValidation]
        public string Email { get; set; }
        [PasswordValidation]
        public string Password { get; set; }
    }
}
