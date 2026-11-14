namespace Infrastructure.Persistence.Configurations.Orders;

internal sealed class OrderStatusChangeConfiguration()
    : ChangeConfiguration<OrderStatusChange, OrderId, OrderStatus>("orders", "OrderStatusChanges", nameof(OrderId));
