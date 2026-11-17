namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class GoodsReceiptConfiguration()
    : AggregateRootConfiguration<GoodsReceipt, GoodsReceiptId>("purchasing", $"{nameof(GoodsReceipt)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<GoodsReceipt> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Navigation(x => x.Discrepancies).AutoInclude();
        builder.Property(x => x.SupplierId);
        builder.Property(x => x.LocationId);
        builder.Property(x => x.PurchaseOrderId);
        builder.Property(x => x.IdempotencyKey).HasMaxLength(128).IsRequired();
        builder.HasIndex(x => x.IdempotencyKey).IsUnique();
        builder.Property(x => x.IsConfirmed);
        builder.Property(x => x.ConfirmedBy);
        builder.Property(x => x.ConfirmedAt);
        builder.HasIndex(x => new { x.LocationId, x.ConfirmedAt });
    }
}
