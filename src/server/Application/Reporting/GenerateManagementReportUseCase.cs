namespace Application.Reporting;

/// <param name="Locations">Empty means the whole chain.</param>
public sealed record ReportRequest(Period Period, IReadOnlyList<LocationId> Locations);

/// <summary>Scenario 3.12 and FR-16. A chain-wide report needs its own permission.</summary>
public sealed class GenerateManagementReportUseCase(IReportQueries queries, ICurrentUser user)
{
    public Task<ManagementReport> ExecuteAsync(ReportRequest request, CancellationToken ct)
    {
        user.Require(Permissions.ReportsView);
        AuthorizeScope(request);
        return queries.BuildManagementReportAsync(request, ct);
    }

    private void AuthorizeScope(ReportRequest request)
    {
        if (request.Locations.Count == 0)
            user.Require(Permissions.ReportsChainWide);
        foreach (var location in request.Locations)
            user.RequireAccess(location);
    }
}
