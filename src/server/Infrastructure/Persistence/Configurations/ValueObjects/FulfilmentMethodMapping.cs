namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal static class FulfilmentMethodMapping
{
    public static void Configure(ComplexPropertyBuilder<FulfilmentMethod> fulfilment)
    {
        fulfilment.Property(x => x.Kind);
        fulfilment.Property(x => x.PickupLocation);
        fulfilment.Property(x => x.DeliveryAddress).HasMaxLength(500);
    }
}
