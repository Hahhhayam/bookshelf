using Domain.Purchasing;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class PurchaseOrderLineConfiguration : IEntityTypeConfiguration<PurchaseOrderLine>
{
    public void Configure(EntityTypeBuilder<PurchaseOrderLine> builder)
    {
        builder.ToTable($"{nameof(PurchaseOrderLine)}s", "purchasing");
        builder.Property<PurchaseOrderId>(nameof(PurchaseOrderId));
        builder.HasKey(nameof(PurchaseOrderId), nameof(PurchaseOrderLine.Id));
        builder.HasOne<PurchaseOrder>().WithMany(o => o.Lines)
            .HasForeignKey(nameof(PurchaseOrderId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Id).HasColumnName(nameof(BookId)).ValueGeneratedNever();
        builder.Property(x => x.Ordered);
        builder.Property(x => x.Received);
        builder.ComplexProperty(x => x.PurchasePrice, MoneyMapping.Configure);
    }
}
