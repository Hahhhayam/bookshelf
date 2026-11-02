namespace Application.Purchasing;

public interface ISupplierRepository
{
    Task<Supplier?> GetAsync(SupplierId id, CancellationToken ct);
}
