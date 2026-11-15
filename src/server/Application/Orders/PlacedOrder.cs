namespace Application.Orders;

/// <summary>The customer needs the pickup code to follow and collect the order, so it is returned at once.</summary>
public sealed record PlacedOrder(OrderId Order, PickupCode PickupCode);
