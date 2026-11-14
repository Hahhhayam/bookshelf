using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Inventory;

internal sealed class StockMovementConfiguration : IEntityTypeConfiguration<StockMovement>
{
    public void Configure(EntityTypeBuilder<StockMovement> builder)
    {
        builder.ToTable($"{nameof(StockMovement)}s", "inventory");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<StockItemId>(nameof(StockItemId));
        builder.HasOne<StockItem>().WithMany(s => s.Movements)
            .HasForeignKey(nameof(StockItemId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Type);
        builder.Property(x => x.Delta);
        builder.ComplexProperty(x => x.Document, DocumentReferenceMapping.Configure);
        builder.Property(x => x.OccurredAt);
        builder.Property(x => x.Reason).HasMaxLength(500);
        builder.Property(x => x.By);
    }
}
