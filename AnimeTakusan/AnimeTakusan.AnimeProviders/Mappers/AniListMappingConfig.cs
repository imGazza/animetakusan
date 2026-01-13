using AnimeTakusan.AnimeProviders.AniListSchema;
using AnimeTakusan.Application.DTOs.AnimeProvider.Responses;
using Mapster;

namespace AnimeTakusan.AnimeProviders.Mappers;

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
    }
}
