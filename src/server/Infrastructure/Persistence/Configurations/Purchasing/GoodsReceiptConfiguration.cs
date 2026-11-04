using Domain.Purchasing;

namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class GoodsReceiptConfiguration()
    : AggregateRootConfiguration<GoodsReceipt, GoodsReceiptId>("purchasing", $"{nameof(GoodsReceipt)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<GoodsReceipt> builder)
    {
        builder.Property(x => x.SupplierId);
        builder.Property(x => x.LocationId);
        builder.Property(x => x.PurchaseOrderId);
        builder.Property(x => x.IsConfirmed);
    }
}
