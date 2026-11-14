namespace Application.Purchasing;

public sealed class UpdateSupplierUseCase(ISupplierRepository suppliers, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(SupplierId id, string name, string? contactInfo, CancellationToken ct)
    {
        user.Require(Permissions.PurchasingManage);
        var supplier = await suppliers.GetAsync(id, ct).OrNotFound("Supplier");
        supplier.Update(name, contactInfo);
        await unitOfWork.CommitAsync(ct);
    }
}
