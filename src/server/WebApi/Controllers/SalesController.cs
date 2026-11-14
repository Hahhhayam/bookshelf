using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record SaleItemDto(Guid Book, int Quantity, MoneyDto? ManualDiscount);

public sealed record PaymentDto(PaymentMethod Method, MoneyDto Amount, string? GiftCertificateNumber);

public sealed record CompleteSaleRequest(Guid Location, Guid? Customer, SaleItemDto[] Items, PaymentDto[] Payments);

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
            request.Items.Select(i => new SaleItemRequest(new BookId(i.Book), new Quantity(i.Quantity), i.ManualDiscount?.ToMoney())).ToList(),
            request.Payments.Select(p => new PaymentRequest(p.Method, p.Amount.ToMoney(), p.GiftCertificateNumber)).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"sales/{id.Value}", new { id = id.Value });
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
        CreateReturnRequest request, [FromServices] CreateReturnUseCase useCase, CancellationToken ct)
    {
        var command = new CreateReturnCommand(
            new SaleId(request.Sale), request.Items.Select(i => i.ToItem()).ToList(),
            new ReturnReason(request.Reason), request.Condition);
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"returns/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.ReturnsConfirm)]
    [HttpPost("returns/{id:guid}/confirm")]
    public async Task<IActionResult> ConfirmReturn(Guid id, [FromServices] ConfirmReturnUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ReturnId(id), ct);
        return NoContent();
    }
}
