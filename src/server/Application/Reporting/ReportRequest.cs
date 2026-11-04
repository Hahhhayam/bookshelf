namespace Application.Reporting;

/// <param name="Locations">Empty means the whole chain.</param>
public sealed record ReportRequest(Period Period, IReadOnlyList<LocationId> Locations);
