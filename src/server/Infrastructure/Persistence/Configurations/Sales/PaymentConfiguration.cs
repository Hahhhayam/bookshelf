using Domain.Sales;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        builder.ToTable($"{nameof(Payment)}s", "sales");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property<SaleId>(nameof(SaleId));
        builder.HasOne<Sale>().WithMany(s => s.Payments).HasForeignKey(nameof(SaleId)).OnDelete(DeleteBehavior.Cascade);
        builder.Property(x => x.Method);
        builder.ComplexProperty(x => x.Amount, MoneyMapping.Configure);
        builder.Property(x => x.Status);
    }
}
