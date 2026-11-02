namespace Application.Inventory;

public interface ITransferRepository
{
    Task<Transfer?> GetAsync(TransferId id, CancellationToken ct);

    void Add(Transfer transfer);
}
