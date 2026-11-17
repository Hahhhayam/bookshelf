using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record SaleItemDto(Guid Book, int Quantity, MoneyDto? ManualDiscount);

public sealed record PaymentDto(PaymentMethod Method, MoneyDto Amount, string? GiftCertificateNumber, MoneyDto? Tendered);

public sealed record CompleteSaleRequest(Guid Location, Guid? Customer, SaleItemDto[] Items, PaymentDto[] Payments);

public sealed record QuoteSaleRequest(Guid Location, Guid? Customer, SaleItemDto[] Items);

public sealed record CreateReturnRequest(Guid Sale, ItemQuantityDto[] Items, string Reason, ItemCondition Condition);

public sealed record IssueGiftCertificateRequest(string Number, MoneyDto Value);

[ApiController]
public sealed class SalesController : ControllerBase
{
    [RequirePermission(Permissions.SalesCreate)]
    [HttpPost("sales")]
    public async Task<IActionResult> Complete(
        CompleteSaleRequest request, [FromHeader(Name = "Idempotency-Key")] string idempotencyKey,
        [FromServices] CompleteSaleUseCase useCase, CancellationToken ct)
    {
        var command = new CompleteSaleCommand(
            new LocationId(request.Location), request.Customer is { } c ? new CustomerId(c) : null,
            new IdempotencyKey(idempotencyKey),
            ToItems(request.Items),
            request.Payments.Select(p => new PaymentRequest(
                p.Method, p.Amount.ToMoney(), p.GiftCertificateNumber, p.Tendered?.ToMoney())).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"sales/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.SalesCreate)]
    [HttpPost("sales/quote")]
    public async Task<IActionResult> Quote(QuoteSaleRequest request, [FromServices] QuoteSaleUseCase useCase, CancellationToken ct)
    {
        var query = new QuoteSaleQuery(
            new LocationId(request.Location), request.Customer is { } c ? new CustomerId(c) : null, ToItems(request.Items));
        var quote = await useCase.ExecuteAsync(query, ct);
        return Ok(new
        {
            lines = quote.Lines.Select(LineView), total = MoneyDto.From(quote.Total),
            bonus = quote.Bonus is { } b ? new { b.Balance, allowed = MoneyDto.From(b.Allowed) } : null,
        });
    }

    [RequirePermission(Permissions.SalesCreate, Permissions.ReturnsCreate, Permissions.ReturnsConfirm)]
    [HttpGet("locations/{location:guid}/sales")]
    public async Task<IActionResult> ListSales(
        Guid location, DateTimeOffset from, DateTimeOffset to, Guid? cashier, [FromServices] ListSalesUseCase useCase,
        CancellationToken ct)
    {
        var query = new ListSalesQuery(new LocationId(location), from, to, cashier is { } u ? new UserId(u) : null);
        var sales = await useCase.ExecuteAsync(query, ct);
        return Ok(sales.Select(s => new
        {
            id = s.Sale.Value, cashier = s.Cashier.Value, customer = s.Customer?.Value, s.CompletedAt, s.Status,
            total = MoneyDto.From(s.Total),
        }));
    }

    [RequirePermission(Permissions.SalesCreate, Permissions.ReturnsCreate, Permissions.ReturnsConfirm)]
    [HttpGet("sales/{id:guid}")]
    public async Task<IActionResult> GetSale(Guid id, [FromServices] GetSaleUseCase useCase, CancellationToken ct)
    {
        var sale = await useCase.ExecuteAsync(new SaleId(id), ct);
        return Ok(new
        {
            id = sale.Id.Value, location = sale.LocationId.Value, cashier = sale.Cashier.Value,
            customer = sale.CustomerId?.Value, sale.CompletedAt, sale.Status, total = MoneyDto.From(sale.Total),
            lines = sale.Lines.Select(LineView),
            payments = sale.Payments.Select(p => new
            {
                id = p.Id, p.Method, amount = MoneyDto.From(p.Amount), p.Status, tendered = MoneyDto.From(p.Tendered),
                change = MoneyDto.From(p.Change),
            }),
        });
    }

    [RequirePermission(Permissions.SalesCreate, Permissions.ShiftsManage)]
    [HttpGet("locations/{location:guid}/shift")]
    public async Task<IActionResult> GetOpenShift(Guid location, [FromServices] GetOpenShiftUseCase useCase, CancellationToken ct)
    {
        var shift = await useCase.ExecuteAsync(new LocationId(location), ct);
        return Ok(new { open = shift is not null, id = shift?.Id.Value, openedAt = shift?.OpenedAt, openedBy = shift?.OpenedBy.Value });
    }

    [RequirePermission(Permissions.ShiftsManage)]
    [HttpPost("locations/{location:guid}/shifts")]
    public async Task<IActionResult> OpenShift(Guid location, [FromServices] OpenShiftUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(new LocationId(location), ct);
        return Created($"shifts/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.ShiftsManage)]
    [HttpPost("shifts/{id:guid}/close")]
    public async Task<IActionResult> CloseShift(Guid id, [FromServices] CloseShiftUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ShiftId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.SalesCreate)]
    [HttpGet("gift-certificates/{number}")]
    public async Task<IActionResult> GetGiftCertificate(
        string number, [FromServices] GetGiftCertificateUseCase useCase, CancellationToken ct)
    {
        var certificate = await useCase.ExecuteAsync(number, ct);
        return Ok(new { id = certificate.Id.Value, certificate.Number, balance = MoneyDto.From(certificate.Balance) });
    }

    [RequirePermission(Permissions.SalesCreate)]
    [HttpPost("gift-certificates")]
    public async Task<IActionResult> IssueGiftCertificate(
        IssueGiftCertificateRequest request, [FromServices] IssueGiftCertificateUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Number, request.Value.ToMoney(), ct);
        return Created($"gift-certificates/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.SalesCancel)]
    [HttpPost("sales/{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, [FromServices] CancelSaleUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SaleId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.SalesCreate)]
    [HttpPost("sales/{id:guid}/payments/{payment:guid}/confirm")]
    public async Task<IActionResult> ConfirmPayment(
        Guid id, Guid payment, [FromServices] ConfirmPendingPaymentUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SaleId(id), payment, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.ReturnsCreate)]
    [HttpPost("returns")]
    public async Task<IActionResult> CreateReturn(
        CreateReturnRequest request, [FromHeader(Name = "Idempotency-Key")] string idempotencyKey,
        [FromServices] CreateReturnUseCase useCase, CancellationToken ct)
    {
        var command = new CreateReturnCommand(
            new SaleId(request.Sale), request.Items.Select(i => i.ToItem()).ToList(),
            new ReturnReason(request.Reason), request.Condition, new IdempotencyKey(idempotencyKey));
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"returns/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.ReturnsCreate, Permissions.ReturnsConfirm)]
    [HttpGet("locations/{location:guid}/returns")]
    public async Task<IActionResult> ListReturns(
        Guid location, ReturnStatus? status, [FromServices] ListReturnsUseCase useCase, CancellationToken ct)
    {
        var returns = await useCase.ExecuteAsync(new LocationId(location), status ?? ReturnStatus.Pending, ct);
        return Ok(returns.Select(r => new
        {
            id = r.Id.Value, sale = r.SaleId.Value, customer = r.CustomerId?.Value, reason = r.Reason.Text, r.Condition,
            r.Status, refundTotal = MoneyDto.From(r.RefundTotal),
            lines = r.Lines.Select(l => new
            {
                book = l.Id.Value, quantity = l.Quantity.Value, unitRefund = MoneyDto.From(l.UnitRefund),
                refund = MoneyDto.From(l.Refund),
            }),
        }));
    }

    [RequirePermission(Permissions.ReturnsConfirm)]
    [HttpPost("returns/{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmReturn(Guid id, [FromServices] ConfirmReturnUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ReturnId(id), ct);
        return NoContent();
    }

    private static List<SaleItemRequest> ToItems(SaleItemDto[] items) =>
        items.Select(i => new SaleItemRequest(new BookId(i.Book), new Quantity(i.Quantity), i.ManualDiscount?.ToMoney())).ToList();

    private static object LineView(SaleLine line) => new
    {
        book = line.BookId.Value, quantity = line.Quantity.Value, unitPrice = MoneyDto.From(line.UnitPrice),
        discount = new { amount = MoneyDto.From(line.Discount.Amount), line.Discount.Source },
        total = MoneyDto.From(line.Total),
    };
}
