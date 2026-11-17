namespace Application.Orders;

/// <param name="UnitPrice">The current catalog price; the order fixes the price only when it is placed.</param>
public sealed record CartItem(BookId Book, string Title, Quantity Quantity, Money UnitPrice);
