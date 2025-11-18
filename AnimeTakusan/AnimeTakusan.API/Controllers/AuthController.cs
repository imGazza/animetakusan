using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnimeTakusan.API.Controllers
{    
    [ApiController]
    [EnableCors("Public")]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet("google")]
        public IActionResult Google()
        {
            var properties = new AuthenticationProperties 
            { 
                RedirectUri = Url.Action(nameof(GoogleCallback))
            };

            return Challenge(properties, "Google");
        }

        [HttpGet("google-callback")]
        public async Task<IActionResult> GoogleCallback()
        {
            if (_configuration["Authentication:Google:RedirectUri"] == null)
            {
                return BadRequest("Google Redirect URI is missing.");
            }

            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if(!authenticateResult.Succeeded)
            {
                return Unauthorized();
            }

            

            return Redirect(_configuration["Authentication:Google:RedirectUri"]!);
        }
    }
}
