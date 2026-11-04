using Application.Orders;
using Domain.Orders;

namespace Infrastructure.Persistence.Repositories.Orders;

internal sealed class OrderRepository(BookstoreDbContext db) : IOrderRepository
{
    public Task<Order?> GetAsync(OrderId id, CancellationToken ct) =>
        db.Set<Order>().FirstOrDefaultAsync(o => o.Id == id, ct);

    public void Add(Order order) => db.Set<Order>().Add(order);
}
