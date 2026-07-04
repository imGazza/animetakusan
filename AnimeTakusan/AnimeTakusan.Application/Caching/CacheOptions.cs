using System;
using System.ComponentModel.DataAnnotations;

namespace AnimeTakusan.Application.Caching;

public class CacheOptions
{
    public const string SectionName = "Cache";

    // Nullable + [Required] => a missing JSON key stays null and fails validation.
    // [Range] also rejects 0/negative values.
    [Required]
    [Range(1, int.MaxValue)]
    public int? AniListTokenTtlDays { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? AniListUserTtlHours { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? AniListLibraryTtlMinutes { get; set; }

    [Required]
    [Range(1, int.MaxValue)]
    public int? AniListPublicDataTtlHours { get; set; }

    // Accessors. Values are guaranteed from the registration in Program.cs that validates values.
    public TimeSpan AniListTokenTtl => TimeSpan.FromDays(AniListTokenTtlDays!.Value);
    public TimeSpan AniListUserTtl => TimeSpan.FromHours(AniListUserTtlHours!.Value);
    public TimeSpan AniListLibraryTtl => TimeSpan.FromMinutes(AniListLibraryTtlMinutes!.Value);
    public TimeSpan AniListPublicDataTtl => TimeSpan.FromHours(AniListPublicDataTtlHours!.Value);
}
