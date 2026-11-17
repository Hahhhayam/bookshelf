namespace Application.Purchasing;

/// <summary>Reference data is deactivated instead of deleted, so purchase orders keep pointing at it.</summary>
public sealed class SetSupplierActiveUseCase(
    ISupplierRepository suppliers, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(SupplierId id, bool active, CancellationToken ct)
    {
        user.Require(Permissions.PurchasingManage);
        var supplier = await suppliers.GetAsync(id, ct).OrNotFound("Supplier");
        var wasActive = supplier.IsActive;
        if (active)
            supplier.Activate();
        else
            supplier.Deactivate();
        audit.Record(active ? "supplier.activated" : "supplier.deactivated", id.ToString(),
            new FieldChange("active", wasActive.ToString(), active.ToString()));
        await unitOfWork.CommitAsync(ct);
    }
}
