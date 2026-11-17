namespace Application.Orders;

public sealed class ListOrdersUseCase(IOrderQueries orders, ICurrentUser user)
{
    public Task<IReadOnlyList<OrderSummary>> ExecuteAsync(
        LocationId location, OrderStatus? status, PickupCode? pickupCode, CancellationToken ct)
    {
        user.Require(Permissions.OrdersManage);
        user.RequireAccess(location);
        return orders.ListAsync(location, status, pickupCode, ct);
    }
}
