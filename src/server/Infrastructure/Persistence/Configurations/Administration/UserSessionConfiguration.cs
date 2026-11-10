using Infrastructure.Persistence.Sessions;

namespace Infrastructure.Persistence.Configurations.Administration;

internal sealed class UserSessionConfiguration : IEntityTypeConfiguration<UserSession>
{
    public void Configure(EntityTypeBuilder<UserSession> builder)
    {
        builder.ToTable("Sessions", "administration");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property(x => x.UserId);
        builder.HasIndex(x => x.UserId);
        builder.Property(x => x.TokenHash).HasMaxLength(64).IsRequired();
        builder.HasIndex(x => x.TokenHash).IsUnique();
        builder.Property(x => x.IssuedAt);
        builder.Property(x => x.ExpiresAt);
        builder.Property(x => x.RevokedAt);
    }
}
