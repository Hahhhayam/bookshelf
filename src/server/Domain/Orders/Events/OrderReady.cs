namespace Domain.Orders;

/// <summary>Leads to a notification to the customer.</summary>
public sealed record OrderReady(
    OrderId OrderId, CustomerId CustomerId, PickupCode PickupCode, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
