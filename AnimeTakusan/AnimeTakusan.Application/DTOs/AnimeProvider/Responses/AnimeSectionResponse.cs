namespace AnimeTakusan.Application.DTOs.AnimeProvider.Responses;

public abstract record AnimeSectionResponse
{
    public abstract AnimeSection Section { get; }
}

public enum AnimeSection
{
    BROWSE = 1
}

public record AnimeBrowseResponse : AnimeSectionResponse
{
    public override AnimeSection Section => AnimeSection.BROWSE;

    public AnimePageResponse Season { get; set; }
    public AnimePageResponse NextSeason { get; set; }
    public AnimePageResponse TopLastSeason { get; set; }
    public AnimePageResponse Top { get; set; }

}