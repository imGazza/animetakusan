using AnimeTakusan.Application.Interfaces;

namespace AnimeTakusan.Infrastructure.Authentication;

public class AniListAuthScope : IInjectable
{
    public bool AttachToken { get; set; }
}
