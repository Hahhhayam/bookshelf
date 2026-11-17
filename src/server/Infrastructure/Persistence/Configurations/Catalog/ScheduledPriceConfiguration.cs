using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Catalog;

/// <summary>Keyed by the book, so a book cannot have two scheduled prices.</summary>
internal sealed class ScheduledPriceConfiguration()
    : AggregateRootConfiguration<ScheduledPrice, BookId>("catalog", $"{nameof(ScheduledPrice)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<ScheduledPrice> builder)
    {
        builder.ComplexProperty(x => x.Price, MoneyMapping.Configure);
        builder.Property(x => x.EffectiveFrom);
        builder.HasIndex(x => x.EffectiveFrom);
        builder.Property(x => x.SetBy);
    }
}
