using Epam.Recipe.AuthorizationService.Application.Service;
using Epam.Recipe.AuthorizationService.Contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Epam.Recipe.AuthorizationService.API.Controllers
{
    [Route("api/login")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly ILoginService _loginService;
        public LoginController(ILoginService loginService)
        {
            _loginService = loginService;
        }

        [HttpPost]
        public async Task<IActionResult> UserLogin([FromBody] LoginDTO user)
        {
            LoginResponseDTO loginResponse = await _loginService.UserLogin(user);
            if (ModelState.IsValid)
            {
                if (loginResponse.Status == "success")
                {
                    return Ok(loginResponse);
                }
                else if (loginResponse.Status == "Incorrect Password")
                {
                    return Unauthorized(loginResponse);
                }
                else if (loginResponse.Status == "User not registered yet")
                {
                    return NotFound(loginResponse);
                }
                else
                {
                    return BadRequest();
                }
            }
            else
            {
                return BadRequest();
            }
        }
    }
}
