namespace Application.Orders;

/// <summary>
/// Scenario 3.8, second half. Issued turns the order's reservations into write-offs;
/// Cancelled releases them.
/// </summary>
public sealed class ChangeOrderStatusUseCase(
    IOrderRepository orders, StockItemLoader stock, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(OrderId orderId, OrderStatus target, CancellationToken ct)
    {
        user.Require(Permissions.OrdersManage);
        var order = await orders.GetAsync(orderId, ct).OrNotFound("Order");
        user.RequireAccess(order.StockLocation);

        await ApplyAsync(order, target, ct);
        await unitOfWork.CommitAsync(ct);
    }

    private async Task ApplyAsync(Order order, OrderStatus target, CancellationToken ct)
    {
        var now = clock.Now;
        switch (target)
        {
            case OrderStatus.Confirmed:
                order.Confirm(user.Id, now);
                break;
            case OrderStatus.Picking:
                order.StartPicking(user.Id, now);
                break;
            case OrderStatus.Ready:
                order.MarkReady(user.Id, now);
                break;
            case OrderStatus.Issued:
                order.Issue(user.Id, now);
                await ForEachReservationAsync(order, (item, reservation) => item.FulfilReservation(reservation, now), ct);
                break;
            case OrderStatus.Cancelled:
                order.Cancel(user.Id, now);
                await ForEachReservationAsync(order, (item, reservation) => item.ReleaseReservation(reservation), ct);
                break;
            default:
                throw new DomainException($"An order cannot be moved to {target} by hand.");
        }
    }

    private async Task ForEachReservationAsync(
        Order order, Action<StockItem, ReservationId> action, CancellationToken ct)
    {
        foreach (var line in order.Lines)
        {
            var item = await stock.RequireAsync(order.StockLocation, line.Id, ct);
            var reservation = item.FindActiveReservation(order.Id.Value)
                              ?? throw new DomainException("The order has no active reservation.");
            action(item, reservation);
        }
    }
}
