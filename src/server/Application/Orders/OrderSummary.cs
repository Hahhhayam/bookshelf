namespace Application.Orders;

/// <summary>A row of the order list (scenario 3.11): current status and its last change.</summary>
public sealed record OrderSummary(
    OrderId Order, CustomerId Customer, OrderType Type, OrderStatus Status, DateTimeOffset? LastChangedAt,
    UserId? LastChangedBy);
