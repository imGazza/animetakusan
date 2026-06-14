using AnimeTakusan.Application.DTOs.Authentication.Responses;
using AnimeTakusan.Domain.Entities;
using Mapster;

namespace AnimeTakusan.Application.Handlers.Mappers;

public class UserMappingRegister : IRegister, IUserMapper
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, UserInfo>()
            .Map(dest => dest.AniListUserId, src => src.AniListUser != null ? src.AniListUser.AniListUserId : (int?)null);
    }
}
