using AnimeTakusan.MAL.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AnimeTakusan.MAL.Infrastructure.Configurations;

public class MalReplayMessageConfiguration : IEntityTypeConfiguration<MalReplayMessage>
{
    public void Configure(EntityTypeBuilder<MalReplayMessage> builder)
    {
        builder.ToTable("MalReplayMessages");

        builder.HasKey(u => u.Id);
        builder.Property(u => u.Id).UseIdentityAlwaysColumn();

        builder.Property(u => u.MalUserId).IsRequired();
        builder.Property(u => u.RawMessage).IsRequired();
        builder.Property(u => u.CreatedAt).IsRequired();
    }
}
