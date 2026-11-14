namespace Application.Orders;

public interface IOrderQueries
{
    Task<OrderView?> FindAsync(OrderId order, CancellationToken ct);

    Task<OrderView?> FindByPickupCodeAsync(PickupCode code, CancellationToken ct);

    /// <summary>Orders whose stock is held at the location; without a status, only those not yet issued or cancelled.</summary>
    Task<IReadOnlyList<OrderSummary>> ListAsync(LocationId location, OrderStatus? status, CancellationToken ct);
}
