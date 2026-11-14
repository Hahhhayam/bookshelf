namespace Domain.Inventory;

public readonly record struct TransferId(Guid Value)
{
    public static TransferId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>Moves goods between locations. Sender and receiver confirm shipment and receipt separately.</summary>
public sealed class Transfer : AggregateRoot<TransferId>
{
    private readonly List<TransferLine> _lines = [];
    private readonly List<Discrepancy> _discrepancies = [];

    public Route Route { get; }
    public TransferStatus Status { get; private set; } = TransferStatus.Created;
    public UserId? ShippedBy { get; private set; }
    public UserId? ReceivedBy { get; private set; }
    public IReadOnlyList<TransferLine> Lines => _lines;
    public IReadOnlyList<Discrepancy> Discrepancies => _discrepancies;

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private Transfer() : base(default) { }

    private Transfer(TransferId id, Route route) : base(id) => Route = route;

    public static Transfer Create(Route route, IEnumerable<ItemQuantity> items)
    {
        var transfer = new Transfer(TransferId.New(), route);
        foreach (var item in items)
        {
            Guard.That(!item.Quantity.IsZero, "Transfer quantity must be positive.");
            Guard.That(transfer._lines.All(l => l.Id != item.BookId), "An item can appear in a transfer only once.");
            transfer._lines.Add(new(item.BookId, item.Quantity));
        }
        Guard.That(transfer._lines.Count > 0, "A transfer needs at least one line.");
        return transfer;
    }

    /// <summary>Approval makes Inventory reserve the goods at the sending location.</summary>
    public void Approve(DateTimeOffset now)
    {
        Require(TransferStatus.Created);
        Status = TransferStatus.Approved;
        Raise(new TransferApproved(Id, Route, Items(l => l.Shipped), now));
    }

    public void Ship(UserId by, DateTimeOffset now)
    {
        Require(TransferStatus.Approved);
        Status = TransferStatus.Shipped;
        ShippedBy = by;
        Raise(new TransferShipped(Id, Route, Items(l => l.Shipped), now));
    }

    /// <summary>Records what the receiver counted. A mismatch creates a discrepancy for review.</summary>
    public void Receive(IReadOnlyDictionary<BookId, Quantity> received, UserId by, DateTimeOffset now)
    {
        Require(TransferStatus.Shipped);
        foreach (var line in _lines)
        {
            line.Received = received.GetValueOrDefault(line.Id);
            if (line.Received != line.Shipped)
                _discrepancies.Add(new(line.Id, line.Shipped, line.Received.Value));
        }
        Status = TransferStatus.Received;
        ReceivedBy = by;
        Raise(new TransferReceived(Id, Route, Items(l => l.Received ?? Quantity.Zero), _discrepancies.Count > 0, now));
    }

    private IReadOnlyList<ItemQuantity> Items(Func<TransferLine, Quantity> quantity) =>
        _lines.Select(l => new ItemQuantity(l.Id, quantity(l))).ToList();

    private void Require(TransferStatus expected) =>
        Guard.That(Status == expected, $"Transfer must be {expected}, but is {Status}.");
}
