using System.Security.Claims;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace AnimeTakusan.API.Controllers
{    
    [ApiController]
    [EnableCors("Public")]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration configuration, ILogger<AuthController> logger, IAuthService authService)
        {
            _configuration = configuration;
            _logger = logger;
            _authService = authService;
        }

        // [HttpGet("token")]
        // public IActionResult Token()
        // {
            
        // }

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

            _authService.AuthenticateWithGoogle(authenticateResult.Principal);

            _logger.LogInformation($"User authenticated: {authenticateResult.Principal.FindFirstValue(ClaimTypes.Email)}");

            return Redirect(_configuration["Authentication:Google:RedirectUri"]!);
        }
    }
}
