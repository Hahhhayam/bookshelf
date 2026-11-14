namespace Domain.Purchasing;

public readonly record struct GoodsReceiptId(Guid Value)
{
    public static GoodsReceiptId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>Receiving a delivery against a purchase order, or an allowed unplanned delivery.</summary>
public sealed class GoodsReceipt : AggregateRoot<GoodsReceiptId>
{
    private readonly List<ReceiptLine> _lines = [];
    private readonly List<Discrepancy> _discrepancies = [];

    public SupplierId SupplierId { get; }
    public LocationId LocationId { get; }

    /// <summary>Null for an unplanned delivery.</summary>
    public PurchaseOrderId? PurchaseOrderId { get; }

    public bool IsConfirmed { get; private set; }
    public IReadOnlyList<ReceiptLine> Lines => _lines;
    public IReadOnlyList<Discrepancy> Discrepancies => _discrepancies;

    private GoodsReceipt(GoodsReceiptId id, SupplierId supplierId, LocationId locationId,
        PurchaseOrderId? purchaseOrderId) : base(id)
    {
        SupplierId = supplierId;
        LocationId = locationId;
        PurchaseOrderId = purchaseOrderId;
    }

    /// <summary>Starts a receipt against a purchase order; ordered quantities come from the order.</summary>
    public static GoodsReceipt AgainstOrder(PurchaseOrder order, LocationId locationId,
        IReadOnlyDictionary<BookId, Quantity> received)
    {
        var receipt = new GoodsReceipt(GoodsReceiptId.New(), order.SupplierId, locationId, order.Id);
        foreach (var line in order.Lines)
            receipt._lines.Add(new(line.Id, line.Ordered - Min(line.Ordered, line.Received),
                received.GetValueOrDefault(line.Id)));
        foreach (var extra in received.Keys.Where(b => order.Lines.All(l => l.Id != b)))
            receipt._lines.Add(new(extra, Quantity.Zero, received[extra]));
        receipt.FindDiscrepancies();
        return receipt;
    }

    public static GoodsReceipt Unplanned(SupplierId supplierId, LocationId locationId, IEnumerable<ItemQuantity> received)
    {
        var receipt = new GoodsReceipt(GoodsReceiptId.New(), supplierId, locationId, null);
        receipt._lines.AddRange(received.Select(r => new ReceiptLine(r.BookId, Quantity.Zero, r.Quantity)));
        Guard.That(receipt._lines.Count > 0, "A receipt needs at least one line.");
        return receipt;
    }

    /// <summary>Stock increases only after this confirmation; Purchasing then updates the purchase order.</summary>
    public void Confirm(UserId by, DateTimeOffset now)
    {
        Guard.That(!IsConfirmed, "The receipt is already confirmed.");
        IsConfirmed = true;
        Raise(new GoodsReceived(Id, PurchaseOrderId, SupplierId, LocationId,
            _lines.Where(l => !l.Received.IsZero).Select(l => new ItemQuantity(l.Id, l.Received)).ToList(),
            _discrepancies.Count > 0, by, now));
    }

    private void FindDiscrepancies() =>
        _discrepancies.AddRange(_lines.Where(l => l.Ordered != l.Received).Select(l => new Discrepancy(l.Id, l.Ordered, l.Received)));

    private static Quantity Min(Quantity a, Quantity b) => a <= b ? a : b;
}
