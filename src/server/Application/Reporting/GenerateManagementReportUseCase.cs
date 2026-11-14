namespace Application.Reporting;

/// <param name="Locations">Empty means the whole chain.</param>
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
        AuthorizeScope(request);
        var data = await queries.LoadAsync(request, ct);
        return ManagementReportCalculator.Calculate(data, request.Period);
    }

    private void AuthorizeScope(ReportRequest request)
    {
        if (request.Locations.Count == 0)
            user.Require(Permissions.ReportsChainWide);
        foreach (var location in request.Locations)
            user.RequireAccess(location);
    }
}
