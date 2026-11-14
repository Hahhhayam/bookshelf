namespace Application.Purchasing;

public interface IPurchaseOrderStatusHistoryRepository
{
    void Add(PurchaseOrderStatusChange change);
}
