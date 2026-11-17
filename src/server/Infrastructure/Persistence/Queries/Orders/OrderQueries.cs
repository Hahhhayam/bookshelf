using Application.Orders;

namespace Infrastructure.Persistence.Queries.Orders;

internal sealed class OrderQueries(BookstoreDbContext db) : IOrderQueries
{
    public async Task<OrderView?> FindAsync(OrderId order, CancellationToken ct) =>
        await ViewOfAsync(await db.Set<Order>().AsNoTracking().FirstOrDefaultAsync(o => o.Id == order, ct), ct);

    public async Task<OrderView?> FindByPickupCodeAsync(PickupCode code, CancellationToken ct) =>
        await ViewOfAsync(await db.Set<Order>().AsNoTracking().FirstOrDefaultAsync(o => o.PickupCode == code, ct), ct);

    public async Task<IReadOnlyList<OrderSummary>> ListAsync(
        LocationId location, OrderStatus? status, PickupCode? pickupCode, CancellationToken ct)
    {
        var orders = Filter(db.Set<Order>().AsNoTracking().Where(o => o.StockLocation == location), status, pickupCode);
        var rows = await orders.Select(o => new { o.Id, o.CustomerId, o.Type, o.Status }).ToListAsync(ct);

        var latest = await LatestChanges.ForAsync<OrderStatusChange, OrderId, OrderStatus>(
            db.Set<OrderStatusChange>(), rows.Select(r => r.Id).ToList(), ct);
        return rows.Select(r => new OrderSummary(r.Id, r.CustomerId, r.Type, r.Status,
            latest.GetValueOrDefault(r.Id)?.At, latest.GetValueOrDefault(r.Id)?.By)).ToList();
    }

    private static IQueryable<Order> Filter(IQueryable<Order> orders, OrderStatus? status, PickupCode? pickupCode)
    {
        if (pickupCode is { } code)
            orders = orders.Where(o => o.PickupCode == code);
        if (status is { } wanted)
            return orders.Where(o => o.Status == wanted);
        return pickupCode is null
            ? orders.Where(o => o.Status != OrderStatus.Issued && o.Status != OrderStatus.Cancelled)
            : orders;
    }

    private async Task<OrderView?> ViewOfAsync(Order? order, CancellationToken ct)
    {
        if (order is null)
            return null;
        var history = await db.Set<OrderStatusChange>().AsNoTracking()
            .Where(c => c.ParentId == order.Id).OrderBy(c => c.At).ToListAsync(ct);
        return new OrderView(order, history);
    }
}
