using Domain.Purchasing;

namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class ReceiptDiscrepancyConfiguration : IEntityTypeConfiguration<Discrepancy>
{
    public void Configure(EntityTypeBuilder<Discrepancy> builder)
    {
        builder.ToTable("ReceiptDiscrepancies", "purchasing");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<GoodsReceiptId>(nameof(GoodsReceiptId));
        builder.HasOne<GoodsReceipt>().WithMany(r => r.Discrepancies)
            .HasForeignKey(nameof(GoodsReceiptId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.BookId);
        builder.Property(x => x.Ordered);
        builder.Property(x => x.Received);
    }
}
