using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using AnimeTakusan.Application.DTOs.AnimeProvider.Requests;

namespace AnimeTakusan.Application.Caching;

public static class CacheKeys
{
    public static string AniListToken(Guid userId) => $"AniListToken:{userId}";
    public static string AniListUserInfo(int aniListUserId) => $"AniListUserInfo:{aniListUserId}";
    public static string AniListLibrary(int aniListUserId) => $"AniListLibrary:{aniListUserId}";
    public static string AniListAnimeById(int aniListAnimeId) => $"AniListAnimeDetail:{aniListAnimeId}";
    public static string AniListBrowseSection(string season, int seasonYear) => $"AniListBrowseSection:{season}:{seasonYear}";

    // The key for the filter is hashed
    public static string AniListFilteredAnime(AnimeFilterRequest request) =>
        $"AniListFilteredAnime:v1:{Hash(BuildCanonicalFilterString(request))}";

    private static string BuildCanonicalFilterString(AnimeFilterRequest request)
    {
        var filter = request.Filter ?? new AnimeFilter();
        var page = request.Page ?? new AnimePage();

        var genres = (filter.GenreIn ?? [])
            .Select(genre => genre?.Trim().ToLowerInvariant())
            .Where(genre => !string.IsNullOrEmpty(genre))
            .Distinct(StringComparer.Ordinal)
            .Order(StringComparer.Ordinal);

        return string.Join('|',
            $"fmt={Normalize(filter.Format)}",
            $"genres={string.Join(',', genres)}",
            $"score={filter.AverageScoreGreater?.ToString(CultureInfo.InvariantCulture) ?? string.Empty}",
            $"season={Normalize(filter.Season)}",
            $"year={filter.SeasonYear?.ToString(CultureInfo.InvariantCulture) ?? string.Empty}",
            $"status={Normalize(filter.Status)}",
            $"sort={Normalize(request.Sort)}",
            $"page={page.Page.ToString(CultureInfo.InvariantCulture)}",
            $"perpage={page.PerPage.ToString(CultureInfo.InvariantCulture)}");
    }

    private static string Normalize(string value) =>
        string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim().ToLowerInvariant();

    private static string Hash(string value) =>
        Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(value)));
}
