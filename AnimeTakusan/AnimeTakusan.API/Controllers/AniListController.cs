using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AnimeTakusan.API.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class AniListController : ControllerBase
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _configuration;
        private readonly IAniListAuthService _aniListAuthService;

        public AniListController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IAniListAuthService aniListAuthService)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _aniListAuthService = aniListAuthService;
        }

        [HttpGet("auth")]
        public async Task<IActionResult> AniListAuth()
        {
            if (!AreAniListAuthSettingsValid())
                return StatusCode(StatusCodes.Status500InternalServerError, "AniList authentication settings are not properly configured.");

            var clientId = _configuration["AniListAuth:ClientId"];
            var redirectUri = _configuration["AniListAuth:RedirectUri"];

            var authUrl = $"{_configuration["AniListAuth:CodeExchangeUrl"]}?client_id={clientId}&redirect_uri={redirectUri}&response_type=code";
            return Redirect(authUrl);
        }

        [HttpGet("callback")]
        public async Task<IActionResult> AniListCallback([FromQuery] string code)
        {            
            _aniListAuthService.VerifyCallbackState(code);
            var client = _httpClientFactory.CreateClient();

            var payload = new
            {
                grant_type = "authorization_code",
                client_id = _configuration["AniListAuth:ClientId"],
                client_secret = _configuration["AniListAuth:ClientSecret"],
                redirect_uri = _configuration["AniListAuth:RedirectUri"],
                code
            };
            var response = await client.PostAsJsonAsync(_configuration["AniListAuth:TokenExchangeUrl"], payload);

            if (!response.IsSuccessStatusCode)
                return StatusCode((int)response.StatusCode, "Authentication to AniList failed.");

            var aniListTokenResponse = await response.Content.ReadFromJsonAsync<AniListTokenResponse>();
            await _aniListAuthService.LinkAniListAccountToUser(aniListTokenResponse);
            return Redirect(_configuration["Authentication:Logged:RedirectUri"]);
        }

        private bool AreAniListAuthSettingsValid()
        {
            return !string.IsNullOrEmpty(_configuration["AniListAuth:ClientId"]) &&
                   !string.IsNullOrEmpty(_configuration["AniListAuth:ClientSecret"]) &&
                   !string.IsNullOrEmpty(_configuration["AniListAuth:RedirectUri"]) &&
                   !string.IsNullOrEmpty(_configuration["AniListAuth:CodeExchangeUrl"]) &&
                   !string.IsNullOrEmpty(_configuration["AniListAuth:TokenExchangeUrl"]);
        }
    }
}
