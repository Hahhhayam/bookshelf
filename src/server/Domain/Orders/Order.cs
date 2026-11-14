namespace Domain.Orders;

public readonly record struct OrderId(Guid Value)
{
    public static OrderId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>A customer order placed through the website, or a large B2B order.</summary>
public sealed class Order : AggregateRoot<OrderId>
{
    private static readonly IReadOnlyDictionary<OrderStatus, OrderStatus[]> Transitions =
        new Dictionary<OrderStatus, OrderStatus[]>
        {
            [OrderStatus.New] = [OrderStatus.Confirmed, OrderStatus.Cancelled],
            [OrderStatus.Confirmed] = [OrderStatus.Picking, OrderStatus.Cancelled],
            [OrderStatus.Picking] = [OrderStatus.Ready, OrderStatus.Cancelled],
            [OrderStatus.Ready] = [OrderStatus.Issued, OrderStatus.Cancelled],
            [OrderStatus.Issued] = [],
            [OrderStatus.Cancelled] = [],
        };

    private readonly List<OrderLine> _lines = [];

    public CustomerId CustomerId { get; }
    public OrderType Type { get; }
    public FulfilmentMethod Fulfilment { get; }

    /// <summary>The location whose stock is reserved for this order; for pickup it is the pickup store.</summary>
    public LocationId StockLocation { get; }

    public PickupCode PickupCode { get; }
    public OrderStatus Status { get; private set; } = OrderStatus.New;
    public IReadOnlyList<OrderLine> Lines => _lines;

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private Order() : base(default) { Fulfilment = null!; }

    private Order(OrderId id, CustomerId customerId, OrderType type, FulfilmentMethod fulfilment,
        LocationId stockLocation, PickupCode pickupCode) : base(id)
    {
        CustomerId = customerId;
        Type = type;
        Fulfilment = fulfilment;
        StockLocation = stockLocation;
        PickupCode = pickupCode;
    }

    public Money Total => Money.Sum(_lines.Select(l => l.Total), _lines[0].UnitPrice.Currency);

    /// <summary>Placing an order makes Inventory reserve the stock.</summary>
    public static Order Place(CustomerId customerId, OrderType type, FulfilmentMethod fulfilment,
        LocationId stockLocation, PickupCode code,
        IEnumerable<(BookId BookId, Quantity Quantity, Money UnitPrice)> lines, DateTimeOffset now)
    {
        var order = new Order(OrderId.New(), customerId, type, fulfilment, stockLocation, code);
        foreach (var (bookId, quantity, unitPrice) in lines)
            order.AddLine(bookId, quantity, unitPrice);
        Guard.That(order._lines.Count > 0, "An order needs at least one line.");
        order.Raise(new OrderPlaced(order.Id, customerId, type, fulfilment, order.OrderedItems(), now));
        return order;
    }

    private void AddLine(BookId bookId, Quantity quantity, Money unitPrice)
    {
        Guard.That(!quantity.IsZero, "Ordered quantity must be positive.");
        Guard.That(_lines.All(l => l.Id != bookId), "An item can appear in an order only once.");
        _lines.Add(new(bookId, quantity, unitPrice));
    }

    private IReadOnlyList<ItemQuantity> OrderedItems() =>
        _lines.Select(l => new ItemQuantity(l.Id, l.Quantity)).ToList();

    public void Confirm(UserId by, DateTimeOffset now) => MoveTo(OrderStatus.Confirmed, by, now);

    public void StartPicking(UserId by, DateTimeOffset now) => MoveTo(OrderStatus.Picking, by, now);

    public void MarkReady(UserId by, DateTimeOffset now)
    {
        MoveTo(OrderStatus.Ready, by, now);
        Raise(new OrderReady(Id, CustomerId, PickupCode, now));
    }

    /// <summary>Handing the order over turns its reservation into a write-off.</summary>
    public void Issue(UserId by, DateTimeOffset now) => MoveTo(OrderStatus.Issued, by, now);

    /// <summary>Cancelling releases the reservation.</summary>
    public void Cancel(UserId by, DateTimeOffset now) => MoveTo(OrderStatus.Cancelled, by, now);

    private void MoveTo(OrderStatus to, UserId by, DateTimeOffset now)
    {
        Guard.That(Transitions[Status].Contains(to), $"An order cannot move from {Status} to {to}.");
        var from = Status;
        Status = to;
        Raise(new OrderStatusChanged(Id, from, to, by, now));
    }
}
