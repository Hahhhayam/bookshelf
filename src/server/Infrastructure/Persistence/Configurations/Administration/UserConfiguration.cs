using Domain.Administration;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Administration;

internal sealed class UserConfiguration() : AggregateRootConfiguration<User, UserId>("administration", $"{nameof(User)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<User> builder)
    {
        builder.Property(x => x.Login).HasMaxLength(128).IsRequired();
        builder.HasIndex(x => x.Login).IsUnique();
        builder.Property(x => x.PasswordHash).HasMaxLength(512);
        builder.Property(x => x.Status);
        builder.Property(x => x.Access).HasConversion<LocationAccessConverter>();
        builder.Ignore(x => x.Roles);
        builder.Property<HashSet<RoleId>>("_roles")
            .HasColumnName(nameof(User.Roles))
            .HasConversion<ValueSetConverter<RoleId, Guid>, ValueSetComparer<RoleId>>();
    }
}
