namespace Application.Reporting;

/// <summary>Loads the sales and stock facts in the report's scope; the figures are computed from them in Application.</summary>
public interface IReportQueries
{
    Task<ReportData> LoadAsync(ReportRequest request, CancellationToken ct);
}
