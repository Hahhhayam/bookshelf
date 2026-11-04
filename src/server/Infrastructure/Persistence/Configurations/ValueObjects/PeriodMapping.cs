namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class PeriodMapping
{
    public static void Configure(ComplexPropertyBuilder<Period> period)
    {
        period.Property(x => x.Start);
        period.Property(x => x.End);
    }
}
