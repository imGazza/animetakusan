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

        config.NewConfig<IGetUserAnimeList_MediaListCollection_Lists_Entries, AnimeListEntry>()
            .Map(dest => dest.Anime, src => src.Media);

        config.NewConfig<IGetAnimeById_Media_Relations_Edges, Relation>()
            .Map(dest => dest.RelationType, src => src.RelationType.ToString())
            .Map(dest => dest.Id, src => src.Node.Id)
            .Map(dest => dest.CoverImage, src => src.Node.CoverImage)
            .Map(dest => dest.Title, src => src.Node.Title)
            .Map(dest => dest.Format, src => src.Node.Format)
            .Map(dest => dest.Status, src => src.Node.Status)
            .Map(dest => dest.Type, src => src.Node.Type);

        config.NewConfig<IGetAnimeById_Media, AnimeDetailResponse>()
            .Map(dest => dest.Relations, src => src.Relations.Edges)
            .Map(dest => dest.Recommendations, src => src.Recommendations.Nodes.Select(n => n.MediaRecommendation).ToList())
            .Map(dest => dest.Reviews, src => src.Reviews.Nodes.Select(n => n).ToList());

        config.NewConfig<IGetAnimeById_Media_Reviews_Nodes_User, User>()
            .Map(dest => dest.Name, src => src.Name)
            .Map(dest => dest.Avatar, src => src.Avatar.Medium);

        config.NewConfig<ToggleFavouriteResult, ToggleFavouriteResponse>()            
            .Map(dest => dest.IsMarkedAsFavourite, src => src.ToggleFavourite.Anime.Nodes.Count > 0);

        config.NewConfig<GetAnimeByIdResult, AnimeDetailResponse>()
            .MapWith(src => src.Media.Adapt<AnimeDetailResponse>());

        config.NewConfig<GetSeasonalAnimeResult, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.Page.PageInfo)
            .Map(dest => dest.Data, src => src.Page.Media);

        config.NewConfig<GetBrowseSectionResult, AnimeBrowseResponse>()
            .Map(dest => dest.Season, src => src.Season)
            .Map(dest => dest.NextSeason, src => src.NextSeason)
            .Map(dest => dest.TopLastSeason, src => src.TopLastSeason)
            .Map(dest => dest.Top, src => src.Top);

        config.NewConfig<GetAnimeResult, AnimePageResponse>()
            .Map(dest => dest.Page, src => src.Page.PageInfo)
            .Map(dest => dest.Data, src => src.Page.Media);

        config.NewConfig<GetUserAnimeListResult, AnimeUserLibraryResponse>()
            .Map(dest => dest.Lists, src => src.MediaListCollection.Lists);

        config.NewConfig<UpsertAnimeEntryResult, AnimeEntryUpsertResponse>()
            .Map(dest => dest.Id, src => src.SaveMediaListEntry.Id)
            .Map(dest => dest.MediaId, src => src.SaveMediaListEntry.MediaId)
            .Map(dest => dest.CreatedAt, src => src.SaveMediaListEntry.CreatedAt)
            .Map(dest => dest.Progress, src => src.SaveMediaListEntry.Progress)
            .Map(dest => dest.Status, src => src.SaveMediaListEntry.Status)
            .Map(dest => dest.CompletedAt, src => src.SaveMediaListEntry.CompletedAt)
            .Map(dest => dest.StartedAt, src => src.SaveMediaListEntry.StartedAt)
            .Map(dest => dest.Score, src => src.SaveMediaListEntry.Score);

        config.NewConfig<DeleteAnimeEntryResult, DeleteAnimeEntryResponse>()
            .Map(dest => dest.Deleted, src => src.DeleteMediaListEntry.Deleted ?? false);
    }
}
