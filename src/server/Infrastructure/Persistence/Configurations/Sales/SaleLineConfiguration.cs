using Domain.Sales;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class SaleLineConfiguration : IEntityTypeConfiguration<SaleLine>
{
    public void Configure(EntityTypeBuilder<SaleLine> builder)
    {
        builder.ToTable($"{nameof(SaleLine)}s", "sales");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<SaleId>(nameof(SaleId));
        builder.HasOne<Sale>().WithMany(s => s.Lines).HasForeignKey(nameof(SaleId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.BookId);
        builder.Property(x => x.Quantity);
        builder.ComplexProperty(x => x.UnitPrice, MoneyMapping.Configure);
        builder.ComplexProperty(x => x.Discount, DiscountMapping.Configure);
        builder.Ignore(x => x.Total);
    }
}
