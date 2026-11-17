using System.Text;
using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Reports;
using WebApi.Security;

namespace WebApi.Controllers;

[ApiController]
public sealed class ReportingController : ControllerBase
{
    [RequirePermission(Permissions.ReportsView)]
    [HttpGet("reports/management")]
    public async Task<IActionResult> Management(
        DateTimeOffset from, DateTimeOffset to, [FromQuery] Guid[] locations, Guid? category, Guid? book,
        [FromServices] GenerateManagementReportUseCase useCase, CancellationToken ct)
    {
        var report = await useCase.ExecuteAsync(ToRequest(from, to, locations, category, book), ct);
        return Ok(new
        {
            revenue = MoneyDto.From(report.Revenue),
            margin = MoneyDto.From(report.Margin),
            report.Receipts,
            averageCheck = MoneyDto.From(report.AverageCheck),
            previousPeriod = new
            {
                revenue = MoneyDto.From(report.PreviousPeriod.Revenue),
                margin = MoneyDto.From(report.PreviousPeriod.Margin),
                report.PreviousPeriod.Receipts,
                averageCheck = MoneyDto.From(report.PreviousPeriod.AverageCheck),
            },
            report.DaysOfStock,
            topBooks = report.TopBooks.Select(b => new { book = b.Book.Value, sold = b.Sold.Value, revenue = MoneyDto.From(b.Revenue) }),
            slowMovingBooks = report.SlowMovingBooks.Select(b => b.Value),
            shortages = report.Shortages.Select(s => new
            {
                location = s.Location.Value, book = s.Book.Value, onHand = s.OnHand.Value, minimum = s.Minimum.Value,
            }),
            abc = report.Abc.Select(a => new
            {
                book = a.Book.Value, revenue = MoneyDto.From(a.Revenue), a.CumulativeShare, a.Class,
            }),
            stores = report.Stores.Select(s => new
            {
                location = s.Location.Value, revenue = MoneyDto.From(s.Revenue), margin = MoneyDto.From(s.Margin),
                s.Receipts, averageCheck = MoneyDto.From(s.AverageCheck),
            }),
            categories = report.Categories.Select(c => new
            {
                category = c.Category?.Value, sold = c.Sold.Value, revenue = MoneyDto.From(c.Revenue),
            }),
        });
    }

    [RequirePermission(Permissions.ReportsView)]
    [HttpGet("reports/management.csv")]
    public async Task<IActionResult> ManagementCsv(
        DateTimeOffset from, DateTimeOffset to, [FromQuery] Guid[] locations, Guid? category, Guid? book,
        [FromServices] GenerateManagementReportUseCase useCase, CancellationToken ct)
    {
        var report = await useCase.ExecuteAsync(ToRequest(from, to, locations, category, book), ct);
        var csv = Encoding.UTF8.GetPreamble().Concat(Encoding.UTF8.GetBytes(ManagementReportCsv.Write(report))).ToArray();
        return File(csv, "text/csv", $"management-report-{from:yyyyMMdd}-{to:yyyyMMdd}.csv");
    }

    private static ReportRequest ToRequest(
        DateTimeOffset from, DateTimeOffset to, Guid[] locations, Guid? category, Guid? book) =>
        new(new Period(from, to), locations.Select(l => new LocationId(l)).ToList(),
            category is { } c ? new CategoryId(c) : null, book is { } b ? new BookId(b) : null);
}
