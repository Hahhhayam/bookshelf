using Domain.Sales;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class DiscountMapping
{
    public static void Configure(ComplexPropertyBuilder<Discount> discount)
    {
        discount.ComplexProperty(x => x.Amount, MoneyMapping.Configure);
        discount.Property(x => x.Source);
    }
}
