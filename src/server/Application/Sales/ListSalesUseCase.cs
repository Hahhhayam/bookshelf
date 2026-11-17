namespace Application.Sales;

public sealed record ListSalesQuery(LocationId Location, DateTimeOffset From, DateTimeOffset To, UserId? Cashier);

/// <summary>The cashier's receipts of a shift or a day, and finding the receipt for a return (scenario 3.6, step 1).</summary>
public sealed class ListSalesUseCase(ISalesQueries queries, ICurrentUser user)
{
    public Task<IReadOnlyList<SaleSummary>> ExecuteAsync(ListSalesQuery query, CancellationToken ct)
    {
        user.RequireAny(Permissions.SalesCreate, Permissions.ReturnsCreate, Permissions.ReturnsConfirm);
        user.RequireAccess(query.Location);
        Guard.That(query.From < query.To, "period-invalid", "The period must end after it starts.");
        return queries.ListSalesAsync(query.Location, query.From, query.To, query.Cashier, ct);
    }
}
