using Domain.Catalog;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Catalog;

internal sealed class PriceEntryConfiguration() : AggregateRootConfiguration<PriceEntry, Guid>("catalog", "PriceEntries")
{
    protected override void ConfigureRoot(EntityTypeBuilder<PriceEntry> builder)
    {
        builder.Property(x => x.BookId);
        builder.HasIndex(x => new { x.BookId, x.ValidFrom });
        builder.ComplexProperty(x => x.Price, MoneyMapping.Configure);
        builder.Property(x => x.ValidFrom);
        builder.Property(x => x.SetBy);
    }
}
