using System.Net.Http.Json;
using AnimeTakusan.MAL.Application.DTOs;
using AnimeTakusan.MAL.Application.Interfaces;
using AnimeTakusan.MAL.Domain.Exception.MalAuthExceptions;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace AnimeTakusan.MAL.Infrastructure.Mal;

public class MalOAuthClient : IMalOAuthClient
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public MalOAuthClient(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<MalTokensResponse> ExchangeCodeAsync(string code, string codeVerifier)
    {
        EnsureValidConfiguration();

        var requestData = new Dictionary<string, string>
        {
            { "client_id", _configuration["Mal:ClientId"]! },
            { "client_secret", _configuration["Mal:ClientSecret"]! },
            { "code", code },
            { "code_verifier", codeVerifier },
            { "grant_type", "authorization_code" },
            { "redirect_uri", _configuration["Mal:RedirectUri"]! }
        };

        return await PostTokenRequestAsync(requestData);
    }

    public async Task<MalTokensResponse> RefreshTokenAsync(string refreshToken)
    {
        EnsureValidConfiguration();

        var requestData = new Dictionary<string, string>
        {
            { "client_id", _configuration["Mal:ClientId"]! },
            { "client_secret", _configuration["Mal:ClientSecret"]! },
            { "grant_type", "refresh_token" },
            { "refresh_token", refreshToken }
        };

        return await PostTokenRequestAsync(requestData);
    }

    private async Task<MalTokensResponse> PostTokenRequestAsync(Dictionary<string, string> requestData)
    {
        var response = await _httpClient.PostAsync(string.Empty, new FormUrlEncodedContent(requestData));
        response.EnsureSuccessStatusCode();

        var tokens = await response.Content.ReadFromJsonAsync<MalTokensResponse>();
        if (tokens == null)
        {
            throw new MalAuthException("MAL token endpoint returned an empty response.");
        }
        
        return tokens;
    }

    private void EnsureValidConfiguration()
    {
        if (string.IsNullOrEmpty(_configuration["Mal:ClientId"]) ||
            string.IsNullOrEmpty(_configuration["Mal:ClientSecret"]) ||
            string.IsNullOrEmpty(_configuration["Mal:RedirectUri"]) ||
            string.IsNullOrEmpty(_configuration["Mal:AuthUrl"]))
        {
            throw new MalAuthException("MAL configuration is missing required values.");
        }
    }
}
