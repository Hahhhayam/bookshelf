namespace Application.Sales;

/// <summary>Scenario 3.6, final step. Damaged books are not put back into sellable stock.</summary>
public sealed class ConfirmReturnUseCase(
    IReturnRepository returns, StockItemLoader stock, ICurrentUser user, IClock clock, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(ReturnId returnId, CancellationToken ct)
    {
        var ret = await returns.GetAsync(returnId, ct).OrNotFound("Return");
        user.RequireAccess(ret.LocationId);

        ret.Confirm(user.Has(Permissions.ReturnsConfirm), user.Id, clock.Now);
        if (ret.Condition != ItemCondition.Damaged)
            await RestockAsync(ret, ct);

        audit.Record("return.confirmed", returnId.ToString(), after: ret.RefundTotal.ToString());
        await unitOfWork.CommitAsync(ct);
    }

    private async Task RestockAsync(Return ret, CancellationToken ct)
    {
        foreach (var line in ret.Lines)
        {
            var item = await stock.GetOrOpenAsync(ret.LocationId, line.Id, ct);
            item.AcceptReturn(line.Quantity, ret.Id.Value, clock.Now);
        }
    }
}
