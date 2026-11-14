namespace Domain.Purchasing;

public sealed class PurchaseOrderStatusChange : Change<PurchaseOrderId, PurchaseOrderStatus>
{
    private PurchaseOrderStatusChange(Guid id, PurchaseOrderId parentId,
        PurchaseOrderStatus from, PurchaseOrderStatus to, DateTimeOffset at, UserId by)
        : base(id, parentId, from, to, at, by) { }

    public static PurchaseOrderStatusChange Record(PurchaseOrderStatusChanged domainEvent) =>
        new(domainEvent.EventId, domainEvent.PurchaseOrderId, domainEvent.From, domainEvent.To,
            domainEvent.OccurredAt, domainEvent.ChangedBy);
}
