namespace Application.Purchasing;

/// <param name="PurchaseOrder">Null for an unplanned delivery, which then needs <paramref name="Supplier"/>.</param>
public sealed record ReceiveDeliveryCommand(
    LocationId Location, PurchaseOrderId? PurchaseOrder, SupplierId? Supplier, IReadOnlyList<ItemQuantity> Received);

/// <summary>Scenario 3.9. Confirming the receipt raises stock and moves the purchase order's status.</summary>
public sealed class ReceiveDeliveryUseCase(
    IGoodsReceiptRepository receipts, IPurchaseOrderRepository orders, StockItemLoader stock, ICurrentUser user,
    IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<GoodsReceiptId> ExecuteAsync(ReceiveDeliveryCommand command, CancellationToken ct)
    {
        user.Require(Permissions.ReceivingConfirm);
        user.RequireAccess(command.Location);

        var order = await LoadOrderAsync(command.PurchaseOrder, ct);
        var receipt = BuildReceipt(command, order);
        receipt.Confirm(user.Id, clock.Now);

        await IncreaseStockAsync(receipt, ct);
        order?.ApplyReceipt(command.Received, user.Id, clock.Now);
        receipts.Add(receipt);
        await unitOfWork.CommitAsync(ct);
        return receipt.Id;
    }

    private async Task<PurchaseOrder?> LoadOrderAsync(PurchaseOrderId? id, CancellationToken ct) =>
        id is { } orderId ? await orders.GetAsync(orderId, ct).OrNotFound("Purchase order") : null;

    private static GoodsReceipt BuildReceipt(ReceiveDeliveryCommand command, PurchaseOrder? order)
    {
        if (order is not null)
            return GoodsReceipt.AgainstOrder(order, command.Location,
                command.Received.ToDictionary(r => r.BookId, r => r.Quantity));

        var supplier = command.Supplier ?? throw new DomainException("An unplanned delivery needs a supplier.");
        return GoodsReceipt.Unplanned(supplier, command.Location, command.Received);
    }

    private async Task IncreaseStockAsync(GoodsReceipt receipt, CancellationToken ct)
    {
        foreach (var line in receipt.Lines.Where(l => !l.Received.IsZero))
        {
            var item = await stock.GetOrOpenAsync(receipt.LocationId, line.Id, ct);
            item.ReceiveGoods(line.Received, receipt.Id.Value, clock.Now);
        }
    }
}
