namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class MoneyMapping
{
    public static void Configure(ComplexPropertyBuilder<Money> money)
    {
        money.Property(x => x.Amount);
        money.Property(x => x.Currency).HasMaxLength(3).IsFixedLength();
    }
}
