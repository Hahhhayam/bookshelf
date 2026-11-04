using Domain.Purchasing;

namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class ReceiptLineConfiguration : IEntityTypeConfiguration<ReceiptLine>
{
    public void Configure(EntityTypeBuilder<ReceiptLine> builder)
    {
        builder.ToTable($"{nameof(ReceiptLine)}s", "purchasing");
        builder.Property<GoodsReceiptId>(nameof(GoodsReceiptId));
        builder.HasKey(nameof(GoodsReceiptId), nameof(ReceiptLine.Id));
        builder.HasOne<GoodsReceipt>().WithMany(r => r.Lines)
            .HasForeignKey(nameof(GoodsReceiptId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Ordered);
        builder.Property(x => x.Received);
    }
}
