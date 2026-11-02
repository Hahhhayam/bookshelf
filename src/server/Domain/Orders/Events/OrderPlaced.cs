namespace Domain.Orders;

/// <summary>Leads to a reservation in Inventory.</summary>
public sealed record OrderPlaced(
    OrderId OrderId, CustomerId CustomerId, OrderType Type, FulfilmentMethod Fulfilment,
    IReadOnlyList<ItemQuantity> Items, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
