namespace Domain.Inventory;

/// <summary>An inventory count at one location. Adjustments are generated only after approval.</summary>
public sealed class InventoryCount : AggregateRoot<InventoryCountId>
{
    private readonly List<CountLine> _lines = [];

    public LocationId LocationId { get; }
    public CountStatus Status { get; private set; } = CountStatus.Open;
    public IReadOnlyList<CountLine> Lines => _lines;

    private InventoryCount(InventoryCountId id, LocationId locationId) : base(id) => LocationId = locationId;

    public static InventoryCount Start(LocationId locationId, IEnumerable<ItemQuantity> expected)
    {
        var count = new InventoryCount(InventoryCountId.New(), locationId);
        count._lines.AddRange(expected.Select(e => new CountLine(e.BookId, e.Quantity)));
        Guard.That(count._lines.Count > 0, "A count needs at least one line.");
        return count;
    }

    public void RecordCount(BookId bookId, Quantity counted)
    {
        Require(CountStatus.Open);
        var line = _lines.FirstOrDefault(l => l.Id == bookId)
                   ?? throw new DomainException("The item is not part of this count.");
        line.Counted = counted;
    }

    public void CompleteCounting()
    {
        Require(CountStatus.Open);
        Guard.That(_lines.All(l => l.Counted is not null), "Every line must be counted.");
        Status = CountStatus.Counted;
    }

    public void Approve()
    {
        Require(CountStatus.Counted);
        Status = CountStatus.Approved;
    }

    public IReadOnlyList<CountAdjustment> Post(DateTimeOffset now)
    {
        Require(CountStatus.Approved);
        Status = CountStatus.Posted;
        var adjustments = _lines
            .Where(l => l.Counted != l.Expected)
            .Select(l => new CountAdjustment(l.Id, l.Counted!.Value))
            .ToList();
        Raise(new InventoryCountPosted(Id, LocationId, adjustments, now));
        return adjustments;
    }

    private void Require(CountStatus expected) =>
        Guard.That(Status == expected, $"Count must be {expected}, but is {Status}.");
}
