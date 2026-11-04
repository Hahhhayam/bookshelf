using Domain.Purchasing;

namespace Infrastructure.Persistence.Configurations.Purchasing;

internal sealed class SupplierConfiguration() : AggregateRootConfiguration<Supplier, SupplierId>("purchasing", $"{nameof(Supplier)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Supplier> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.ContactInfo).HasMaxLength(1000);
        builder.Property(x => x.IsActive);
    }
}
