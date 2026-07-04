using System;

namespace AnimeTakusan.Application.Interfaces;

public interface IAniListTokenProvider
{
    Task<string> GetAniListTokenAsync(Guid userId);
}
