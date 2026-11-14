using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class GiftCertificateConfiguration()
    : AggregateRootConfiguration<GiftCertificate, GiftCertificateId>("sales", $"{nameof(GiftCertificate)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<GiftCertificate> builder)
    {
        builder.Property(x => x.Number).HasMaxLength(64).IsRequired();
        builder.HasIndex(x => x.Number).IsUnique();
        builder.ComplexProperty(x => x.Balance, MoneyMapping.Configure);
    }
}
