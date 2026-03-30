using System;
using AnimeTakusan.Application.DTOs.Authentication.Responses;

namespace AnimeTakusan.Application.Interfaces;

public interface IAniListAuthService
{
    void VerifyCallbackState(string code);
    Task LinkAniListAccountToUser(AniListTokenResponse aniListTokenData);
}
