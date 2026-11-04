using Domain.Administration;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Administration;

internal sealed class RoleConfiguration() : AggregateRootConfiguration<Role, RoleId>("administration", $"{nameof(Role)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Role> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(100).IsRequired();
        builder.HasIndex(x => x.Name).IsUnique();
        builder.Ignore(x => x.Permissions);
        builder.Property<HashSet<Permission>>("_permissions")
            .HasColumnName(nameof(Role.Permissions))
            .HasConversion<ValueSetConverter<Permission, string>, ValueSetComparer<Permission>>();
    }
}
