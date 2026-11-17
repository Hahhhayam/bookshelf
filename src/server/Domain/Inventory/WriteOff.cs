namespace Domain.Inventory;

public readonly record struct WriteOffId(Guid Value)
{
    public static WriteOffId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

public sealed class WriteOff : AggregateRoot<WriteOffId>
{
    private readonly List<WriteOffLine> _lines = [];

    public LocationId LocationId { get; }
    public WriteOffReason Reason { get; }
    public UserId CreatedBy { get; }
    public DateTimeOffset CreatedAt { get; }
    public IReadOnlyList<WriteOffLine> Lines => _lines;

    private WriteOff(WriteOffId id, LocationId locationId, WriteOffReason reason, UserId createdBy,
        DateTimeOffset createdAt) : base(id)
    {
        LocationId = locationId;
        Reason = reason;
        CreatedBy = createdBy;
        CreatedAt = createdAt;
    }

    public static WriteOff Create(LocationId locationId, WriteOffReason reason, IEnumerable<ItemQuantity> items,
        UserId createdBy, DateTimeOffset now)
    {
        var document = new WriteOff(WriteOffId.New(), locationId, reason, createdBy, now);
        foreach (var item in items)
        {
            Guard.That(!item.Quantity.IsZero, "quantity-not-positive", "Write-off quantity must be positive.");
            Guard.That(document._lines.All(l => l.Id != item.BookId), "line-duplicate", "An item can appear in a write-off only once.");
            document._lines.Add(new(item.BookId, item.Quantity));
        }
        Guard.That(document._lines.Count > 0, "lines-empty", "A write-off needs at least one line.");
        return document;
    }
}
