using System.Security.Cryptography;
using AnimeTakusan.MAL.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AnimeTakusan.MAL.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class MalAuthController : ControllerBase
    {
        private readonly IMalAuthService _malAuthService;
        private readonly IConfiguration _configuration;

        public MalAuthController(IMalAuthService malAuthService, IConfiguration configuration)
        {
            _malAuthService = malAuthService;
            _configuration = configuration;
        }

        [HttpGet("callback")]
        public async Task<IActionResult> Callback([FromQuery] string code, [FromQuery] string state)
        {
            var storedState = Request.Cookies["state"];
            var codeVerifier = Request.Cookies["code_verifier"];

            if (string.IsNullOrEmpty(storedState) || !CryptographicOperations.FixedTimeEquals(
            System.Text.Encoding.UTF8.GetBytes(state),
            System.Text.Encoding.UTF8.GetBytes(storedState)))
            {
                return BadRequest("Invalid state parameter.");
            }

            if(string.IsNullOrEmpty(codeVerifier))
            {
                return BadRequest("Code verifier is missing.");
            }

            Response.Cookies.Delete("state");
            Response.Cookies.Delete("code_verifier");

            await _malAuthService.AuthenticateMalUser(code, codeVerifier, state);

            return Redirect(_configuration["Mal:AuthSuccessRedirectUri"] ?? "/");
        }
    }
}
