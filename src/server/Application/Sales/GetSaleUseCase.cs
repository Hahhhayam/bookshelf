namespace Application.Sales;

public sealed class GetSaleUseCase(ISaleRepository sales, ICurrentUser user)
{
    public async Task<Sale> ExecuteAsync(SaleId saleId, CancellationToken ct)
    {
        user.RequireAny(Permissions.SalesCreate, Permissions.ReturnsCreate, Permissions.ReturnsConfirm);
        var sale = await sales.GetAsync(saleId, ct).OrNotFound("Sale");
        user.RequireAccess(sale.LocationId);
        return sale;
    }
}
