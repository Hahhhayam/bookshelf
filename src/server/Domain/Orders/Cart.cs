namespace Domain.Orders;

public sealed class Cart : AggregateRoot<CartId>
{
    private readonly List<CartLine> _lines = [];

    public CustomerId CustomerId { get; }
    public IReadOnlyList<CartLine> Lines => _lines;

    private Cart(CartId id, CustomerId customerId) : base(id) => CustomerId = customerId;

    public static Cart Create(CustomerId customerId) => new(CartId.New(), customerId);

    public void Add(BookId bookId, Quantity quantity)
    {
        Guard.That(!quantity.IsZero, "Quantity must be positive.");
        var line = _lines.FirstOrDefault(l => l.Id == bookId);
        if (line is null)
            _lines.Add(new(bookId, quantity));
        else
            line.Quantity += quantity;
    }

    public void SetQuantity(BookId bookId, Quantity quantity)
    {
        if (quantity.IsZero)
        {
            Remove(bookId);
            return;
        }
        var line = _lines.FirstOrDefault(l => l.Id == bookId) ?? throw new DomainException("The item is not in the cart.");
        line.Quantity = quantity;
    }

    public void Remove(BookId bookId) => _lines.RemoveAll(l => l.Id == bookId);

    public void Clear() => _lines.Clear();
}
