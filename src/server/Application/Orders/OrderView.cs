namespace Application.Orders;

public sealed record OrderView(Order Order, IReadOnlyList<OrderStatusChange> History);
