using Epam.Recipe.AuthorizationService.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Epam.Recipe.AuthorizationService.Application
{
    public class RegistrationValidator
    {
        public (bool IsValid, string ErrorMessage) Validate(RegistrationDto userDto)
        {
            if (string.IsNullOrEmpty(userDto.Email) || !IsValidEmail(userDto.Email))
                return (false, "Invalid email address.");

            if (string.IsNullOrEmpty(userDto.Password) || !IsValidPassword(userDto.Password))
                return (false, "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.");

            if (userDto.Password != userDto.ConfirmPassword)
                return (false, "Passwords do not match.");

            return (true, string.Empty);
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private bool IsValidPassword(string password)
        {
            if (password.Length < 8)
                return false;

            var hasUpperChar = new Regex(@"[A-Z]");
            var hasNumber = new Regex(@"[0-9]");
            var hasSpecialChar = new Regex(@"[\W_]");

            return hasUpperChar.IsMatch(password) && hasNumber.IsMatch(password) && hasSpecialChar.IsMatch(password);
        }
    }
}
