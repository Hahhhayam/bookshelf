namespace Application.Orders;

public interface IOrderQueries
{
    Task<OrderView?> FindAsync(OrderId order, CancellationToken ct);

    Task<OrderView?> FindByPickupCodeAsync(PickupCode code, CancellationToken ct);

    /// <summary>
    /// Orders whose stock is held at the location. Without a status and a pickup code, only those not yet issued or
    /// cancelled; a pickup code finds its order whatever the status, so staff can see why it cannot be issued.
    /// </summary>
    Task<IReadOnlyList<OrderSummary>> ListAsync(
        LocationId location, OrderStatus? status, PickupCode? pickupCode, CancellationToken ct);
}
