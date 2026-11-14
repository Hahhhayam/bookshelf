namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class PromotionConditionMapping
{
    public static void Configure(ComplexPropertyBuilder<PromotionCondition> condition)
    {
        condition.Property(x => x.BookId);
        condition.Property(x => x.CategoryId);
        condition.Property(x => x.MinimumQuantity);
    }
}
