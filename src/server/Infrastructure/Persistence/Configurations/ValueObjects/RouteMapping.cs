namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class RouteMapping
{
    public static void Configure(ComplexPropertyBuilder<Route> route)
    {
        route.Property(x => x.From);
        route.Property(x => x.To);
    }
}
