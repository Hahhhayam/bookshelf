namespace Application.Sales;

public sealed class CancelSaleUseCase(
    ISaleRepository sales, StockItemLoader stock, ICurrentUser user, IClock clock, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(SaleId saleId, CancellationToken ct)
    {
        var sale = await sales.GetAsync(saleId, ct).OrNotFound("Sale");
        user.RequireAccess(sale.LocationId);

        sale.Cancel(user.Has(Permissions.SalesCancel), user.Id, clock.Now);
        foreach (var line in sale.Lines)
        {
            var item = await stock.RequireAsync(sale.LocationId, line.BookId, ct);
            item.AcceptReturn(line.Quantity, sale.Id.Value, clock.Now);
        }

        audit.Record("sale.cancelled", saleId.ToString(), after: sale.Total.ToString());
        await unitOfWork.CommitAsync(ct);
    }
}
