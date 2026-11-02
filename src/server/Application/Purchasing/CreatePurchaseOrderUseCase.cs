namespace Application.Purchasing;

public sealed record CreatePurchaseOrderCommand(
    SupplierId Supplier, DateOnly ExpectedDate, IReadOnlyList<PurchaseOrderLineRequest> Lines);

public sealed class CreatePurchaseOrderUseCase(
    IPurchaseOrderRepository orders, ISupplierRepository suppliers, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task<PurchaseOrderId> ExecuteAsync(CreatePurchaseOrderCommand command, CancellationToken ct)
    {
        user.Require(Permissions.PurchasingManage);
        var supplier = await suppliers.GetAsync(command.Supplier, ct).OrNotFound("Supplier");
        Guard.That(supplier.IsActive, "The supplier is deactivated.");

        var order = PurchaseOrder.Create(command.Supplier, command.ExpectedDate,
            command.Lines.Select(l => (l.Book, l.Quantity, l.PurchasePrice)));
        orders.Add(order);
        await unitOfWork.CommitAsync(ct);
        return order.Id;
    }
}
