namespace Application.Sales;

public sealed record QuoteSaleQuery(LocationId Location, CustomerId? Customer, IReadOnlyList<SaleItemRequest> Items);

/// <summary>Scenario 3.5, steps 2-3: promotions, a permitted manual discount and the allowed bonus write-off.</summary>
public sealed class QuoteSaleUseCase(SaleLinePricer pricer, SaleBonusRedeemer bonusRedeemer, ICurrentUser user, IClock clock)
{
    public async Task<SaleQuote> ExecuteAsync(QuoteSaleQuery query, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        user.RequireAccess(query.Location);

        var lines = await pricer.PriceAsync(query.Items, query.Customer, clock.Now, ct);
        var total = Sale.TotalOf(lines);
        var bonus = query.Customer is { } customer ? await bonusRedeemer.WriteOffAsync(customer, total, ct) : null;
        return new SaleQuote(lines, total, bonus);
    }
}
