using Domain.Inventory;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class TransferConfiguration() : AggregateRootConfiguration<Transfer, TransferId>("inventory", $"{nameof(Transfer)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Transfer> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Navigation(x => x.Discrepancies).AutoInclude();
        builder.ComplexProperty(x => x.Route, RouteMapping.Configure);
        builder.Property(x => x.Status);
        builder.Property(x => x.ShippedBy);
        builder.Property(x => x.ReceivedBy);
    }
}
