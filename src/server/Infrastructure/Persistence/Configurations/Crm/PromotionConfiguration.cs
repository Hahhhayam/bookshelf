using Domain.Crm;
using Infrastructure.Persistence.Configurations.ValueObjects;

namespace Infrastructure.Persistence.Configurations.Crm;

internal sealed class PromotionConfiguration() : AggregateRootConfiguration<Promotion, PromotionId>("crm", $"{nameof(Promotion)}s")
{
    protected override void ConfigureRoot(EntityTypeBuilder<Promotion> builder)
    {
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.ComplexProperty(x => x.Period, PeriodMapping.Configure);
        builder.ComplexProperty(x => x.Condition, PromotionConditionMapping.Configure);
        builder.Property(x => x.DiscountPercent);
        builder.Property(x => x.Priority);
    }
}
