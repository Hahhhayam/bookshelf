using WebApi.Contracts;

namespace WebApi.Endpoints;

internal static class ReportingEndpoints
{
    public static void MapReportingEndpoints(this IEndpointRouteBuilder app) =>
        app.MapGet("/reports/management", ManagementAsync);

    private static async Task<IResult> ManagementAsync(
        DateTimeOffset from, DateTimeOffset to, Guid[]? locations,
        GenerateManagementReportUseCase useCase, CancellationToken ct)
    {
        var request = new ReportRequest(new Period(from, to), (locations ?? []).Select(l => new LocationId(l)).ToList());
        var report = await useCase.ExecuteAsync(request, ct);
        return Results.Ok(new
        {
            revenue = MoneyDto.From(report.Revenue),
            margin = MoneyDto.From(report.Margin),
            averageCheck = MoneyDto.From(report.AverageCheck),
            topBooks = report.TopBooks.Select(b => new { book = b.Book.Value, sold = b.Sold.Value, revenue = MoneyDto.From(b.Revenue) }),
            slowMovingBooks = report.SlowMovingBooks.Select(b => b.Value),
        });
    }
}
