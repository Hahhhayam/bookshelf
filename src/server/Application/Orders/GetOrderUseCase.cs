namespace Application.Orders;

/// <summary>The order card with its status history (scenarios 3.10 and 3.11).</summary>
public sealed class GetOrderUseCase(IOrderQueries orders, ICurrentUser user)
{
    public async Task<OrderView> ExecuteAsync(OrderId orderId, CancellationToken ct)
    {
        user.Require(Permissions.OrdersManage);
        var view = await orders.FindAsync(orderId, ct).OrNotFound("Order");
        user.RequireAccess(view.Order.StockLocation);
        return view;
    }
}
