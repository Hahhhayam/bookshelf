namespace Domain.Orders;

public sealed record FulfilmentMethod
{
    public FulfilmentKind Kind { get; }
    public LocationId? PickupLocation { get; }
    public string? DeliveryAddress { get; }

    private FulfilmentMethod(FulfilmentKind kind, LocationId? pickupLocation, string? deliveryAddress)
    {
        Kind = kind;
        PickupLocation = pickupLocation;
        DeliveryAddress = deliveryAddress;
    }

    public static FulfilmentMethod Pickup(LocationId location) => new(FulfilmentKind.Pickup, location, null);

    public static FulfilmentMethod Delivery(string address) => new(FulfilmentKind.Delivery, null, Guard.NotBlank(address));
}
