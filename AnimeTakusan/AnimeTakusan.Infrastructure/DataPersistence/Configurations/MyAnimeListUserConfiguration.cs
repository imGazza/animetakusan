using System;
using AnimeTakusan.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeTakusan.Infrastructure.DataPersistence.Configurations;

public class MyAnimeListUserConfiguration : IEntityTypeConfiguration<MyAnimeListUser>
{
    public void Configure(EntityTypeBuilder<MyAnimeListUser> builder)
    {
        builder.ToTable("MyAnimeListUsers");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).UseIdentityAlwaysColumn();
        
        builder.Property(u => u.UserId).IsRequired();
        builder.Property(u => u.MalUserId).IsRequired();
        builder.Property(u => u.RefreshTokenExpiry).IsRequired();

        builder.Property(u => u.Status).IsRequired();
        builder.Property(x => x.Status).HasConversion<string>();

        builder.Property(u => u.CreatedAt).IsRequired();
        builder.Property(u => u.UpdatedAt).IsRequired();

        builder.HasIndex(u => u.UserId).IsUnique();
        builder.HasIndex(u => u.MalUserId).IsUnique();
    }
}
