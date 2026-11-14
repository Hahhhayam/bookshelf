namespace Domain.Inventory;

/// <summary>Leads to a transfer status history entry.</summary>
public sealed record TransferStatusChanged(
    TransferId TransferId, TransferStatus From, TransferStatus To, UserId ChangedBy, DateTimeOffset OccurredAt)
    : IDomainEvent
{
    public Guid EventId { get; } = Guid.CreateVersion7();
}
