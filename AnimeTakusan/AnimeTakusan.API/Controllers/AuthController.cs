using AnimeTakusan.Application.DTOs.Authentication.Requests;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace AnimeTakusan.API.Controllers
{    
    [ApiController]
    [EnableCors("Public")]
    [EnableRateLimiting("auth")]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;

        public AuthController(IConfiguration configuration, IAuthService authService)
        {
            _configuration = configuration;
            _authService = authService;
        }

        [EnableRateLimiting("token")]
        [HttpGet("token")]
        public async Task<IActionResult> Token()
        {
            return Ok(await _authService.Token());
        }

        [EnableRateLimiting("token")]
        [HttpGet("user")]
        public async Task<IActionResult> GetUserInfo()
        {
            var user = await _authService.GetUserInfo();
            if (user == null)
            {
                return Ok(new {});
            }
            return Ok(user);
        }

        [Authorize(Roles = "Guest, User")]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest loginRequest)
        {
            await _authService.Login(loginRequest);
            return Ok();
        }        

        [Authorize(Roles = "Guest")]
        [HttpPost("signup")]
        public async Task<IActionResult> SignUp(RegisterRequest registerRequest)
        {
            if (_configuration["Authentication:Logged:RedirectUri"] == null)
            {
                return BadRequest("Redirect URI is missing.");
            }

            await _authService.SignUp(registerRequest);
            return Ok();
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

            // Clean up the temporary Identity.External cookie
            await HttpContext.SignOutAsync(IdentityConstants.ExternalScheme);

            return Redirect(_configuration["Authentication:Logged:RedirectUri"]!);
        }

        [Authorize(Roles = "User")]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _authService.Logout();
            return Ok();
        }
    }
}
