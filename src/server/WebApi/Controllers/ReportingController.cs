using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

[ApiController]
public sealed class ReportingController : ControllerBase
{
    [RequirePermission(Permissions.ReportsView)]
    [HttpGet("reports/management")]
    public async Task<IActionResult> Management(
        DateTimeOffset from, DateTimeOffset to, [FromQuery] Guid[] locations,
        [FromServices] GenerateManagementReportUseCase useCase, CancellationToken ct)
    {
        var request = new ReportRequest(new Period(from, to), locations.Select(l => new LocationId(l)).ToList());
        var report = await useCase.ExecuteAsync(request, ct);
        return Ok(new
        {
            revenue = MoneyDto.From(report.Revenue),
            margin = MoneyDto.From(report.Margin),
            averageCheck = MoneyDto.From(report.AverageCheck),
            topBooks = report.TopBooks.Select(b => new { book = b.Book.Value, sold = b.Sold.Value, revenue = MoneyDto.From(b.Revenue) }),
            slowMovingBooks = report.SlowMovingBooks.Select(b => b.Value),
        });
    }
}
