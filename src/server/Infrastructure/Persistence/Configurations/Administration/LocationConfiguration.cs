using Domain.Administration;

namespace Infrastructure.Persistence.Configurations.Administration;

internal sealed class LocationConfiguration()
    : AggregateRootConfiguration<Location, LocationId>("administration", $"{nameof(Location)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Location> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Type);
        builder.Property(x => x.Address).HasMaxLength(500);
        builder.Property(x => x.IsActive);
    }
}
