namespace Application.Purchasing;

public interface ISupplierQueries
{
    /// <summary>All suppliers by name, inactive ones included, so old purchase orders still show theirs.</summary>
    Task<IReadOnlyList<Supplier>> ListAsync(CancellationToken ct);
}
