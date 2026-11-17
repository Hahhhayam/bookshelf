namespace Domain.Purchasing;

public readonly record struct PurchaseOrderId(Guid Value)
{
    public static PurchaseOrderId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

public sealed class PurchaseOrder : AggregateRoot<PurchaseOrderId>
{
    private readonly List<PurchaseOrderLine> _lines = [];

    public SupplierId SupplierId { get; }

    /// <summary>When the delivery is expected; used to flag overdue deliveries.</summary>
    public DateOnly ExpectedDate { get; }

    public PurchaseOrderStatus Status { get; private set; } = PurchaseOrderStatus.Draft;
    public bool OverdueNotified { get; private set; }
    public IReadOnlyList<PurchaseOrderLine> Lines => _lines;

    private PurchaseOrder(PurchaseOrderId id, SupplierId supplierId, DateOnly expectedDate) : base(id)
    {
        SupplierId = supplierId;
        ExpectedDate = expectedDate;
    }

    /// <summary>The new draft starts its status history, so the list and the card show who created it and when.</summary>
    public static PurchaseOrder Create(SupplierId supplierId, DateOnly expectedDate,
        IEnumerable<(BookId BookId, Quantity Quantity, Money PurchasePrice)> lines, UserId by, DateTimeOffset now)
    {
        var order = new PurchaseOrder(PurchaseOrderId.New(), supplierId, expectedDate);
        foreach (var (bookId, quantity, price) in lines)
        {
            Guard.That(!quantity.IsZero, "quantity-not-positive", "Ordered quantity must be positive.");
            Guard.That(order._lines.All(l => l.Id != bookId), "line-duplicate", "An item can appear in a purchase order only once.");
            order._lines.Add(new(bookId, quantity, price));
        }
        Guard.That(order._lines.Count > 0, "lines-empty", "A purchase order needs at least one line.");
        order.MoveTo(PurchaseOrderStatus.Draft, by, now);
        return order;
    }

    public void Send(UserId by, DateTimeOffset now)
    {
        Guard.That(Status == PurchaseOrderStatus.Draft, "purchase-order-status-invalid", "Only a draft order can be sent.");
        MoveTo(PurchaseOrderStatus.Sent, by, now);
    }

    public void Cancel(UserId by, DateTimeOffset now)
    {
        Guard.That(Status is PurchaseOrderStatus.Draft or PurchaseOrderStatus.Sent,
            "purchase-order-status-invalid", "Only an order with no deliveries can be cancelled.");
        MoveTo(PurchaseOrderStatus.Cancelled, by, now);
    }

    /// <summary>Called when a goods receipt is confirmed; updates received quantities and the status.</summary>
    public void ApplyReceipt(IEnumerable<ItemQuantity> received, UserId by, DateTimeOffset now)
    {
        Guard.That(Status is PurchaseOrderStatus.Sent or PurchaseOrderStatus.PartlyReceived,
            "purchase-order-status-invalid", "The order is not awaiting delivery.");
        foreach (var item in received)
        {
            var line = _lines.FirstOrDefault(l => l.Id == item.BookId);
            if (line is not null)
                line.Received += item.Quantity;
        }
        var next = _lines.All(l => l.Received >= l.Ordered)
            ? PurchaseOrderStatus.Received
            : PurchaseOrderStatus.PartlyReceived;
        if (next != Status)
            MoveTo(next, by, now);
    }

    public bool IsOverdue(DateOnly today) => IsLate(Status, ExpectedDate, today);

    /// <summary>Late means past the expected date while goods are still awaited.</summary>
    public static bool IsLate(PurchaseOrderStatus status, DateOnly expectedDate, DateOnly today) =>
        today > expectedDate && status is PurchaseOrderStatus.Sent or PurchaseOrderStatus.PartlyReceived;

    private void MoveTo(PurchaseOrderStatus to, UserId by, DateTimeOffset now)
    {
        Raise(new PurchaseOrderStatusChanged(Id, Status, to, by, now));
        Status = to;
    }

    /// <summary>A delivery late against its expected date raises a notification, once.</summary>
    public void CheckOverdue(DateOnly today, DateTimeOffset now)
    {
        if (OverdueNotified || !IsOverdue(today))
            return;

        OverdueNotified = true;
        Raise(new PurchaseOrderOverdue(Id, SupplierId, ExpectedDate, now));
    }
}
