namespace Application.Orders;

public interface IOrderStatusHistoryRepository
{
    void Add(OrderStatusChange change);
}
