namespace Domain.Sales;

public readonly record struct ReturnId(Guid Value)
{
    public static ReturnId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

public sealed class Return : AggregateRoot<ReturnId>
{
    private readonly List<ReturnLine> _lines = [];

    public SaleId SaleId { get; }
    public LocationId LocationId { get; }
    public CustomerId? CustomerId { get; }
    public ReturnReason Reason { get; }
    public ItemCondition Condition { get; }
    public ReturnStatus Status { get; private set; } = ReturnStatus.Pending;
    public IdempotencyKey IdempotencyKey { get; }
    public IReadOnlyList<ReturnLine> Lines => _lines;

    private Return(ReturnId id, SaleId saleId, LocationId locationId, CustomerId? customerId, ReturnReason reason,
        ItemCondition condition, IdempotencyKey idempotencyKey) : base(id)
    {
        SaleId = saleId;
        LocationId = locationId;
        CustomerId = customerId;
        Reason = reason;
        Condition = condition;
        IdempotencyKey = idempotencyKey;
    }

    /// Per item: sold quantity minus earlier returns. A resent command with the same key must be detected by the
    /// caller before this point.
    public static Return Create(Sale sale, IEnumerable<ItemQuantity> items,
        IReadOnlyDictionary<BookId, Quantity> returnable, ReturnReason reason, ItemCondition condition,
        IdempotencyKey key)
    {
        Guard.That(sale.Status == SaleStatus.Completed, "sale-not-completed", "Goods can be returned only for a completed sale.");

        var ret = new Return(ReturnId.New(), sale.Id, sale.LocationId, sale.CustomerId, reason, condition, key);
        foreach (var item in items)
            ret.AddLine(sale, item, returnable);
        Guard.That(ret._lines.Count > 0, "lines-empty", "A return needs at least one line.");
        return ret;
    }

    private void AddLine(Sale sale, ItemQuantity item, IReadOnlyDictionary<BookId, Quantity> returnable)
    {
        Guard.That(!item.Quantity.IsZero, "quantity-not-positive", "Returned quantity must be positive.");
        Guard.That(_lines.All(l => l.Id != item.BookId), "line-duplicate", "An item can appear in a return only once.");
        Guard.That(item.Quantity <= returnable.GetValueOrDefault(item.BookId),
            "return-quantity-exceeded", "Returned quantity exceeds what was sold minus earlier returns.");

        var saleLine = sale.Lines.First(l => l.BookId == item.BookId);
        // The customer gets back what was actually paid per unit, after the discount.
        var unitRefund = saleLine.Total * (1m / saleLine.Quantity.Value);
        _lines.Add(new(item.BookId, item.Quantity, unitRefund));
    }

    public Money RefundTotal => Money.Sum(_lines.Select(l => l.Refund), _lines[0].UnitRefund.Currency);

    /// <summary>Stock and money change only after confirmation. Rights are checked; the caller audits it.</summary>
    public void Confirm(bool userMayReturn, UserId by, DateTimeOffset now)
    {
        Guard.That(userMayReturn, "return-not-permitted", "The user has no right to confirm returns.");
        Guard.That(Status == ReturnStatus.Pending, "return-confirmed", "The return is already confirmed.");
        Status = ReturnStatus.Confirmed;
        Raise(new ReturnConfirmed(Id, SaleId, LocationId, CustomerId,
            _lines.Select(l => new ItemQuantity(l.Id, l.Quantity)).ToList(), RefundTotal, Condition, by, now));
    }
}
