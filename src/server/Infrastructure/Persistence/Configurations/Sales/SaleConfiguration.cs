using Domain.Sales;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Sales;

internal sealed class SaleConfiguration() : AggregateRootConfiguration<Sale, SaleId>("sales", $"{nameof(Sale)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Sale> builder)
    {
        builder.Navigation(x => x.Lines).AutoInclude();
        builder.Navigation(x => x.Payments).AutoInclude();
        builder.Property(x => x.LocationId);
        builder.Property(x => x.Cashier);
        builder.Property(x => x.CustomerId);
        builder.Property(x => x.IdempotencyKey).HasMaxLength(128).IsRequired();
        builder.HasIndex(x => x.IdempotencyKey).IsUnique();
        builder.Property(x => x.CompletedAt);
        builder.HasIndex(x => new { x.LocationId, x.CompletedAt });
        builder.Property(x => x.Status);
        builder.ComplexProperty(x => x.Total, MoneyMapping.Configure);
    }
}
