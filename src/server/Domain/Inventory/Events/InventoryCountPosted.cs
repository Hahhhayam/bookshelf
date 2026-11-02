namespace Domain.Inventory;

public sealed record InventoryCountPosted(
    InventoryCountId CountId, LocationId LocationId, IReadOnlyList<CountAdjustment> Adjustments,
    DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
