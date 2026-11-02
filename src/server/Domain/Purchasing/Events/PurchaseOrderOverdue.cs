namespace Domain.Purchasing;

/// <summary>Leads to an overdue delivery notification.</summary>
public sealed record PurchaseOrderOverdue(
    PurchaseOrderId PurchaseOrderId, SupplierId SupplierId, DateOnly ExpectedDate, DateTimeOffset OccurredAt) : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
