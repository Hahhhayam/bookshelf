namespace Application.Sales;

public interface ISalesQueries
{
    /// <summary>Sales of the store completed in [from, to), newest first; optionally only one cashier's.</summary>
    Task<IReadOnlyList<SaleSummary>> ListSalesAsync(
        LocationId location, DateTimeOffset from, DateTimeOffset to, UserId? cashier, CancellationToken ct);

    Task<IReadOnlyList<Return>> ListReturnsAsync(LocationId location, ReturnStatus status, CancellationToken ct);
}
