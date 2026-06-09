using AnimeTakusan.AnimeProviders.AniListSchema;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using Mapster;

namespace AnimeTakusan.AnimeProviders.AniList.Mappers;

/// <summary>
/// Configures Mapster mappings for AniList provider models to application DTOs.
/// Implements IRegister to enable automatic registration of mapping configurations.
/// </summary>
public class AniListMappingConfig : IRegister, IAnimeProviderMapper
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<IGetSeasonalAnime_Page, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.PageInfo)
            .Map(dest => dest.Data, src => src.Media);

        config.NewConfig<IGetBrowseSection_Season, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.PageInfo)
            .Map(dest => dest.Data, src => src.Media);

        config.NewConfig<IGetBrowseSection_NextSeason, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.PageInfo)
            .Map(dest => dest.Data, src => src.Media);

        config.NewConfig<IGetBrowseSection_TopLastSeason, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.PageInfo)
            .Map(dest => dest.Data, src => src.Media);

        config.NewConfig<IGetBrowseSection_Top, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.PageInfo)
            .Map(dest => dest.Data, src => src.Media);

        config.NewConfig<IGetAnime_Page, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.PageInfo)
            .Map(dest => dest.Data, src => src.Media);

        config.NewConfig<IGetUserAnimeList_MediaListCollection_Lists_Entries, AnimeListEntry>()
            .Map(dest => dest.Anime, src => src.Media);

        config.NewConfig<IGetAnimeById_Media_Relations_Edges, Relation>()
            .Map(dest => dest.RelationType, src => src.RelationType.ToString())
            .Map(dest => dest.Id, src => src.Node.Id)
            .Map(dest => dest.CoverImage, src => src.Node.CoverImage)
            .Map(dest => dest.Title, src => src.Node.Title)
            .Map(dest => dest.Format, src => src.Node.Format)
            .Map(dest => dest.Status, src => src.Node.Status);

        config.NewConfig<IGetAnimeById_Media, AnimeDetailResponse>()
            .Map(dest => dest.Relations, src => src.Relations.Edges)
            .Map(dest => dest.Recommendations, src => src.Recommendations.Nodes.Select(n => n.MediaRecommendation).ToList())
            .Map(dest => dest.Reviews, src => src.Reviews.Nodes.Select(n => n).ToList());

        config.NewConfig<IGetAnimeById_Media_Reviews_Nodes_User, User>()
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Avatar, src => src.Avatar.Medium);

        config.NewConfig<ToggleFavouriteResult, ToggleFavouriteResponse>()            
            .Map(dest => dest.IsMarkedAsFavorite, src => src.ToggleFavourite.Anime.Nodes.Count > 0);
    }
}
