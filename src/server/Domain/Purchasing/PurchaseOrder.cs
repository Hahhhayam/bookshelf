namespace Domain.Purchasing;

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

    public static PurchaseOrder Create(SupplierId supplierId, DateOnly expectedDate,
        IEnumerable<(BookId BookId, Quantity Quantity, Money PurchasePrice)> lines)
    {
        var order = new PurchaseOrder(PurchaseOrderId.New(), supplierId, expectedDate);
        foreach (var (bookId, quantity, price) in lines)
        {
            Guard.That(!quantity.IsZero, "Ordered quantity must be positive.");
            Guard.That(order._lines.All(l => l.Id != bookId), "An item can appear in a purchase order only once.");
            order._lines.Add(new(bookId, quantity, price));
        }
        Guard.That(order._lines.Count > 0, "A purchase order needs at least one line.");
        return order;
    }

    public void Send()
    {
        Guard.That(Status == PurchaseOrderStatus.Draft, "Only a draft order can be sent.");
        Status = PurchaseOrderStatus.Sent;
    }

    public void Cancel()
    {
        Guard.That(Status is PurchaseOrderStatus.Draft or PurchaseOrderStatus.Sent,
            "Only an order with no deliveries can be cancelled.");
        Status = PurchaseOrderStatus.Cancelled;
    }

    /// <summary>Called when a goods receipt is confirmed; updates received quantities and the status.</summary>
    public void ApplyReceipt(IEnumerable<ItemQuantity> received)
    {
        Guard.That(Status is PurchaseOrderStatus.Sent or PurchaseOrderStatus.PartlyReceived,
            "The order is not awaiting delivery.");
        foreach (var item in received)
        {
            var line = _lines.FirstOrDefault(l => l.Id == item.BookId);
            if (line is not null)
                line.Received += item.Quantity;
        }
        Status = _lines.All(l => l.Received >= l.Ordered)
            ? PurchaseOrderStatus.Received
            : PurchaseOrderStatus.PartlyReceived;
    }

    /// <summary>A delivery late against its expected date raises a notification, once.</summary>
    public void CheckOverdue(DateOnly today, DateTimeOffset now)
    {
        if (OverdueNotified || today <= ExpectedDate)
            return;
        if (Status is not (PurchaseOrderStatus.Sent or PurchaseOrderStatus.PartlyReceived))
            return;

        OverdueNotified = true;
        Raise(new PurchaseOrderOverdue(Id, SupplierId, ExpectedDate, now));
    }
}
