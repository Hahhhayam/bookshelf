namespace Application.Purchasing;

/// <summary>Purchasing picks suppliers for orders; receiving shows whose delivery it is.</summary>
public sealed class ListSuppliersUseCase(ISupplierQueries suppliers, ICurrentUser user)
{
    public Task<IReadOnlyList<Supplier>> ExecuteAsync(CancellationToken ct)
    {
        user.RequireAny(Permissions.PurchasingManage, Permissions.ReceivingConfirm);
        return suppliers.ListAsync(ct);
    }
}
