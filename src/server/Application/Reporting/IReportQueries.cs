namespace Application.Reporting;

/// <summary>Reads the projections and materialized views that Reporting builds from the other contexts' events.</summary>
public interface IReportQueries
{
    Task<ManagementReport> BuildManagementReportAsync(ReportRequest request, CancellationToken ct);
}
