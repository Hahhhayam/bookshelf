namespace Infrastructure.Persistence.Conventions;

internal static class DomainConventions
{
    public static ModelConfigurationBuilder UseDomainConventions(this ModelConfigurationBuilder builder)
    {
        builder.Properties<Enum>().HaveConversion<string>().HaveMaxLength(32);
        builder.Properties<decimal>().HavePrecision(18, 2);
        StoreSingleValueObjectsAsTheirValue(builder);
        return builder;
    }

    private static void StoreSingleValueObjectsAsTheirValue(ModelConfigurationBuilder builder)
    {
        var domain = typeof(Domain.Catalog.Book).Assembly;
        foreach (var (model, provider) in SingleValueObject.Find(typeof(Money).Assembly, domain))
            builder.Properties(model).HaveConversion(typeof(SingleValueConverter<,>).MakeGenericType(model, provider));
    }
}
