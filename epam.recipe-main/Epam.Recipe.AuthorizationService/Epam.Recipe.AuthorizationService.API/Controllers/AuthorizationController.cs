using Epam.Recipe.AuthorizationService.Application.Service;
using Epam.Recipe.AuthorizationService.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
//using Raven.Client.Exceptions;

namespace Epam.Recipe.AuthorizationService.API.Controllers
{
    [Route("api/auth")]
    [ApiController]
    public class AuthorizationController : ControllerBase
    {
        private readonly IAuthorizationService _authorizationService;
        public AuthorizationController(IAuthorizationService authorizationService)
        {
            _authorizationService = authorizationService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser([FromBody] RegistrationDto dto)
        {
            try
            {
                (bool isValid, string message) = await _authorizationService.RegisterUserAsync(dto);
                if (isValid)
                {
                    return StatusCode(201, "User registered successfully.");
                }
                else
                {
                    return StatusCode(409, message);
                }
            }
            catch (ConflictException ex)
            {
                return Conflict(ex.Message);
            }
            catch (BadRequestException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
    public class ConflictException : Exception{  public ConflictException(string message) : base(message) {  }
    }

    public class BadRequestException : Exception { public BadRequestException(string message) : base(message) { }
    }


}
