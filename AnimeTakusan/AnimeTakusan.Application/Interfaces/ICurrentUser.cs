namespace AnimeTakusan.Application.Interfaces;

public interface ICurrentUser
{
    int? AniListUserId { get; }

    int? UserId { get; }
}
