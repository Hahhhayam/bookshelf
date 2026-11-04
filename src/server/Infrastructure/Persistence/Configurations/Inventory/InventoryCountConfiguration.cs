using Domain.Inventory;

namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class InventoryCountConfiguration()
    : AggregateRootConfiguration<InventoryCount, InventoryCountId>("inventory", $"{nameof(InventoryCount)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<InventoryCount> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Property(x => x.LocationId);
        builder.Property(x => x.Status);
    }
}
