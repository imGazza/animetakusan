using System.Security.Claims;
using System.Threading.Tasks;
using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
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

        [HttpGet("token")]
        public async Task<IActionResult> Token()
        {
            return Ok(await _authService.Token());
        }

        [Authorize(Roles = "Guest")]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            return Ok(await _authService.Login(loginRequest));
        }

        [Authorize(Roles = "Guest")]
        [HttpPost("sign-up")]
        public async Task<IActionResult> SignUp(RegisterRequest registerRequest)
        {
            if (_configuration["Authentication:Logged:RedirectUri"] == null)
            {
                return BadRequest("Redirect URI is missing.");
            }

            await _authService.SignUp(registerRequest);
            return Ok();
        }

        [Authorize(Roles = "Guest")]
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
            if (_configuration["Authentication:Logged:RedirectUri"] == null)
            {
                return BadRequest("Redirect URI is missing.");
            }

            var authenticateResult = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if(!authenticateResult.Succeeded)
            {
                return Unauthorized();
            }

            await _authService.AuthenticateWithGoogle(authenticateResult.Principal);

            _logger.LogInformation($"User authenticated: {authenticateResult.Principal.FindFirstValue(ClaimTypes.Email)}");

            return Redirect(_configuration["Authentication:Logged:RedirectUri"]!);
        }
    }
}
