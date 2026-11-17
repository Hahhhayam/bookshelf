namespace Application.Inventory;

public sealed record AdjustStockCommand(LocationId Location, BookId Book, Quantity NewOnHand, AdjustmentReason Reason);

public sealed class AdjustStockUseCase(
    StockItemLoader stock, ICurrentUser user, IClock clock, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(AdjustStockCommand command, CancellationToken ct)
    {
        user.Require(Permissions.StockAdjust);
        user.RequireAccess(command.Location);

        var item = await stock.GetOrOpenAsync(command.Location, command.Book, ct);
        var before = item.OnHand;
        item.Adjust(command.NewOnHand, command.Reason, user.Id, Guid.CreateVersion7(), clock.Now);

        audit.Record("stock.adjusted", $"{command.Location}/{command.Book}",
            new FieldChange("onHand", before.ToString(), item.OnHand.ToString()), FieldChange.Set("reason", command.Reason.Text));
        await unitOfWork.CommitAsync(ct);
    }
}
