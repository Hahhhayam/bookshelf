namespace Domain.Inventory;

public sealed class TransferStatusChange : Change<TransferId, TransferStatus>
{
    private TransferStatusChange(
        Guid id, TransferId parentId, TransferStatus from, TransferStatus to, DateTimeOffset at, UserId by)
        : base(id, parentId, from, to, at, by) { }

    public static TransferStatusChange Record(TransferStatusChanged domainEvent) =>
        new(domainEvent.EventId, domainEvent.TransferId, domainEvent.From, domainEvent.To,
            domainEvent.OccurredAt, domainEvent.ChangedBy);
}
