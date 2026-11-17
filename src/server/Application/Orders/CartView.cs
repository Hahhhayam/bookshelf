namespace Application.Orders;

/// <param name="Total">Null for an empty cart, which has no currency to sum in.</param>
public sealed record CartView(IReadOnlyList<CartItem> Lines, Money? Total);
