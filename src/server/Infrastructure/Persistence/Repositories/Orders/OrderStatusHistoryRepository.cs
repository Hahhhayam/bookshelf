using Application.Orders;

namespace Infrastructure.Persistence.Repositories.Orders;

internal sealed class OrderStatusHistoryRepository(BookstoreDbContext db) : IOrderStatusHistoryRepository
{
    public void Add(OrderStatusChange change) => db.Set<OrderStatusChange>().Add(change);
}
