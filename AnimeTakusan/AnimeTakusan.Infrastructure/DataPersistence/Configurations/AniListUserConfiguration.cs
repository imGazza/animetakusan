using AnimeTakusan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeTakusan.Infrastructure.DataPersistence.Configurations;

public class AniListUserConfiguration : IEntityTypeConfiguration<AniListUser>
{
    public void Configure(EntityTypeBuilder<AniListUser> builder)
    {
        builder.ToTable("AniListUsers");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).UseIdentityAlwaysColumn();
        builder.Property(u => u.AniListUserId).IsRequired();
        builder.Property(u => u.UserId).IsRequired();
        builder.Property(u => u.AccessToken).HasMaxLength(255);
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt).IsRequired();
    }
}
