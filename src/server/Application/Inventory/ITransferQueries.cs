namespace Application.Inventory;

public interface ITransferQueries
{
    Task<TransferView?> FindAsync(TransferId transfer, CancellationToken ct);

    /// <summary>
    /// Transfers sent from or to the location; without a status, those not yet received plus received ones with
    /// unresolved discrepancies.
    /// </summary>
    Task<IReadOnlyList<TransferSummary>> ListAsync(LocationId location, TransferStatus? status, CancellationToken ct);
}
