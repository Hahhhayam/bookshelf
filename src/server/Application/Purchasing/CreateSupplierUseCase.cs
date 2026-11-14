namespace Application.Purchasing;

public sealed class CreateSupplierUseCase(ISupplierRepository suppliers, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<SupplierId> ExecuteAsync(string name, string? contactInfo, CancellationToken ct)
    {
        user.Require(Permissions.PurchasingManage);
        var supplier = Supplier.Create(name, contactInfo);
        suppliers.Add(supplier);
        await unitOfWork.CommitAsync(ct);
        return supplier.Id;
    }
}
