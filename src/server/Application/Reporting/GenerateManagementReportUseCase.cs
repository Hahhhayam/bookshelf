namespace Application.Reporting;

/// <param name="Locations">From the client, empty means the whole chain; the use case replaces it with the user's own locations, so the queries always filter.</param>
/// <param name="Category">Narrows sales and stock to one category.</param>
/// <param name="Book">Narrows sales and stock to one book.</param>
public sealed record ReportRequest(
    Period Period, IReadOnlyList<LocationId> Locations, CategoryId? Category = null, BookId? Book = null);

/// <summary>Scenario 3.12 and FR-16. A chain-wide report needs its own permission.</summary>
public sealed class GenerateManagementReportUseCase(IReportQueries queries, ICurrentUser user)
{
    public async Task<ManagementReport> ExecuteAsync(ReportRequest request, CancellationToken ct)
    {
        user.Require(Permissions.ReportsView);
        request = AuthorizedScope(request);
        var data = await queries.LoadAsync(request, ct);
        var previous = await queries.LoadAsync(request with { Period = PeriodBefore(request.Period) }, ct);
        return ManagementReportCalculator.Calculate(data, previous, request.Period);
    }

    /// <summary>The comparison period (table 1.1, "порівняння періодів"): equally long, ending where the report's starts.</summary>
    private static Period PeriodBefore(Period period) => new(period.Start - (period.End - period.Start), period.Start);

    /// <summary>Whole chain means every location the user is assigned to; a user with none gets an empty report.</summary>
    private ReportRequest AuthorizedScope(ReportRequest request)
    {
        if (request.Locations.Count == 0)
        {
            user.Require(Permissions.ReportsChainWide);
            return request with { Locations = user.AccessibleLocations.ToList() };
        }
        foreach (var location in request.Locations)
            user.RequireAccess(location);
        return request;
    }
}
