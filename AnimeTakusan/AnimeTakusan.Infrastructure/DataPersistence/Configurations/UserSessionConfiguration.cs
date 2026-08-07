
using AnimeTakusan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeTakusan.Infrastructure.DataPersistence.Configurations;

public class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.ToTable("UserSessions");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).UseIdentityAlwaysColumn();

        builder.Property(u => u.RefreshToken).IsRequired().HasMaxLength(255);
        builder.Property(u => u.RefreshTokenExpiryTime).IsRequired();
        builder.Property(u => u.UserId).IsRequired();
        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt).IsRequired();

        builder.HasIndex(u => u.RefreshToken).IsUnique();
        builder.HasIndex(u => u.UserId);

        builder.HasOne(u => u.User)
            .WithMany(u => u.Sessions)
            .HasForeignKey(u => u.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
