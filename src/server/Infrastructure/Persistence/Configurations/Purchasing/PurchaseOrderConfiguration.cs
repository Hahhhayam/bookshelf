using Domain.Purchasing;

namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class PurchaseOrderConfiguration()
    : AggregateRootConfiguration<PurchaseOrder, PurchaseOrderId>("purchasing", $"{nameof(PurchaseOrder)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<PurchaseOrder> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Property(x => x.SupplierId);
        builder.Property(x => x.ExpectedDate);
        builder.Property(x => x.Status);
        builder.HasIndex(x => x.Status);
        builder.Property(x => x.OverdueNotified);
    }
}
