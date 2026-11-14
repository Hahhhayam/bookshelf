namespace Application.Inventory;

public interface ITransferStatusHistoryRepository
{
    void Add(TransferStatusChange change);
}
