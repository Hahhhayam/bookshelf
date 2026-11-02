namespace Domain.Orders;

/// <summary>Turns the reservation into a write-off (Issued) or releases it (Cancelled).</summary>
public sealed record OrderStatusChanged(
    OrderId OrderId, OrderStatus From, OrderStatus To, UserId ChangedBy, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
