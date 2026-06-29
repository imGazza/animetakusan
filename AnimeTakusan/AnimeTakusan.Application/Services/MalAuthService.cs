using System.Security.Cryptography;
using AnimeTakusan.Application.Interfaces;
using Microsoft.AspNetCore.WebUtilities;

namespace AnimeTakusan.Application.Services;

public class MalAuthService : IMalAuthService, IInjectable
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtHandler _jwtHandler;

    public MalAuthService(IUserRepository userRepository, IJwtHandler jwtHandler)
    {
        _userRepository = userRepository;
        _jwtHandler = jwtHandler;
    }

    public string GeneratePKCECodeVerifier()
    {
        // Generate a random code verifier
        return WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(96));
    }

    public async Task<string> GenerateStateParameterAsync()
    {
        var user = await _userRepository.GetUserByRefreshToken(_jwtHandler.GetRefreshToken());
        if (user == null)
            throw new ArgumentException("Internal logged user not found.");

        var nonce = WebEncoders.Base64UrlEncode(RandomNumberGenerator.GetBytes(32));
        var state = WebEncoders.Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes($"{user.Id}:{nonce}"));

        return state;
    }
}
