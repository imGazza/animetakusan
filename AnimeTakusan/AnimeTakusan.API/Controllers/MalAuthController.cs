using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AnimeTakusan.API.Controllers
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
        
        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
            if(_configuration["Mal:AuthUrl"] is null)
                return StatusCode(StatusCodes.Status500InternalServerError, "MAL Auth URL is not configured.");

            string codeVerifier = _malAuthService.GeneratePKCECodeVerifier();
            string state = await _malAuthService.GenerateStateParameterAsync();

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Path = "/",
                Secure = true,
                SameSite = Enum.Parse<SameSiteMode>(_configuration["CookiesSettings:SameSite"] ?? "Lax"),
                Expires = DateTimeOffset.UtcNow.AddMinutes(5),
                Domain = _configuration["CookiesSettings:Domain"]
            };

            Response.Cookies.Append("state", state, cookieOptions);
            Response.Cookies.Append("code_verifier", codeVerifier, cookieOptions);

            string malAuthUrl = $"{_configuration["Mal:AuthUrl"]}?"
            + $"response_type=code&"
            + $"redirect_uri={_configuration["Mal:RedirectUri"]}&"
            + $"client_id={_configuration["Mal:ClientId"]}&"
            + $"state={state}&"
            + $"code_challenge={codeVerifier}&"
            + $"code_challenge_method=plain";

            return Redirect(malAuthUrl);
        }
    }
}
