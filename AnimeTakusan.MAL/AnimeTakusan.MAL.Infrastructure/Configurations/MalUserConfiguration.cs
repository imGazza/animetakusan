using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeTakusan.MAL.Domain.Configurations;

public class MalUserConfiguration : IEntityTypeConfiguration<MalUser>
{
    public void Configure(EntityTypeBuilder<MalUser> builder)
    {
        builder.ToTable("MalUsers");
        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).UseIdentityAlwaysColumn();
        builder.Property(u => u.UserId).IsRequired();
        builder.Property(u => u.MalUserId).IsRequired();
        builder.Property(u => u.RefreshToken);
        builder.Property(u => u.AccessToken);
        builder.Property(u => u.RefreshTokenExpiresAt).IsRequired();
        builder.Property(u => u.AccessTokenExpiresAt).IsRequired();
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt).IsRequired();

        builder.HasIndex(u => u.MalUserId).IsUnique();
        builder.HasIndex(u => u.UserId).IsUnique();
    }
}
