// This file extends the StrawberryShake-generated concrete types so they implement
// all query-specific interfaces that share the same shape. The obj/ folder is not
// committed to the repo, so CI regenerates AniListClient.Client.cs and may produce
// query-specific interfaces (e.g. IGetSeasonalAnime_Page_Media_Title) instead of the
// shared IGetAnimeById_* interfaces. Declaring them here ensures the shared
// GetAnimeById_* concrete types satisfy both variants, keeping the fakers working
// in every environment without modification.

namespace AnimeTakusan.AnimeProviders.AniListSchema;

// ------ Title ------
public partial class GetAnimeById_Media_Title_MediaTitle :
    IGetSeasonalAnime_Page_Media_Title,
    IGetBrowseSection_Season_Media_Title,
    IGetBrowseSection_NextSeason_Media_Title,
    IGetBrowseSection_TopLastSeason_Media_Title,
    IGetBrowseSection_Top_Media_Title
{ }

// ------ CoverImage ------
public partial class GetAnimeById_Media_CoverImage_MediaCoverImage :
    IGetSeasonalAnime_Page_Media_CoverImage,
    IGetBrowseSection_Season_Media_CoverImage,
    IGetBrowseSection_NextSeason_Media_CoverImage,
    IGetBrowseSection_TopLastSeason_Media_CoverImage,
    IGetBrowseSection_Top_Media_CoverImage
{ }

// ------ Studios StudioConnection ------
public partial class GetAnimeById_Media_Studios_StudioConnection :
    IGetSeasonalAnime_Page_Media_Studios,
    IGetBrowseSection_Season_Media_Studios,
    IGetBrowseSection_NextSeason_Media_Studios,
    IGetBrowseSection_TopLastSeason_Media_Studios,
    IGetBrowseSection_Top_Media_Studios
{ }
