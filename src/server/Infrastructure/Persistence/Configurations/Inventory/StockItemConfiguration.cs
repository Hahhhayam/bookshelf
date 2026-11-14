namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class StockItemConfiguration()
    : AggregateRootConfiguration<StockItem, StockItemId>("inventory", $"{nameof(StockItem)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<StockItem> builder)
    {
        builder.Navigation(x => x.Reservations).AutoInclude();
        builder.Property(x => x.LocationId);
        builder.Property(x => x.BookId);
        builder.HasIndex(x => new { x.LocationId, x.BookId }).IsUnique();
        builder.Property(x => x.OnHand);
        builder.Property(x => x.MinimumStock);
        builder.Ignore(x => x.Reserved);
        builder.Ignore(x => x.Level);
    }
}
