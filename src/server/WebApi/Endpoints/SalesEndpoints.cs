using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;

namespace WebApi.Endpoints;

public sealed record SaleItemDto(Guid Book, int Quantity, MoneyDto? ManualDiscount);

public sealed record PaymentDto(PaymentMethod Method, MoneyDto Amount, string? GiftCertificateNumber);

public sealed record CompleteSaleRequest(Guid Location, Guid? Customer, SaleItemDto[] Items, PaymentDto[] Payments);

public sealed record CreateReturnRequest(Guid Sale, ItemQuantityDto[] Items, string Reason, ItemCondition Condition);

internal static class SalesEndpoints
{
    private const string IdempotencyKeyHeader = "Idempotency-Key";

    public static void MapSalesEndpoints(this IEndpointRouteBuilder app)
    {
        var sales = app.MapGroup("/sales");
        sales.MapPost("/", CompleteAsync);
        sales.MapPost("/{id:guid}/cancel", CancelAsync);
        sales.MapPost("/{id:guid}/payments/{payment:guid}/confirm", ConfirmPaymentAsync);

        var returns = app.MapGroup("/returns");
        returns.MapPost("/", CreateReturnAsync);
        returns.MapPost("/{id:guid}/confirm", ConfirmReturnAsync);
    }

    private static async Task<IResult> CompleteAsync(
        CompleteSaleRequest request, [FromHeader(Name = IdempotencyKeyHeader)] string idempotencyKey,
        CompleteSaleUseCase useCase, CancellationToken ct)
    {
        var command = new CompleteSaleCommand(
            new LocationId(request.Location), request.Customer is { } c ? new CustomerId(c) : null,
            new IdempotencyKey(idempotencyKey),
            request.Items.Select(i => new SaleItemRequest(new BookId(i.Book), new Quantity(i.Quantity), i.ManualDiscount?.ToMoney())).ToList(),
            request.Payments.Select(p => new PaymentRequest(p.Method, p.Amount.ToMoney(), p.GiftCertificateNumber)).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/sales/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> CancelAsync(Guid id, CancelSaleUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SaleId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> ConfirmPaymentAsync(
        Guid id, Guid payment, ConfirmPendingPaymentUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SaleId(id), payment, ct);
        return Results.NoContent();
    }

    private static async Task<IResult> CreateReturnAsync(
        CreateReturnRequest request, CreateReturnUseCase useCase, CancellationToken ct)
    {
        var command = new CreateReturnCommand(
            new SaleId(request.Sale), request.Items.Select(i => i.ToItem()).ToList(),
            new ReturnReason(request.Reason), request.Condition);
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/returns/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> ConfirmReturnAsync(Guid id, ConfirmReturnUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ReturnId(id), ct);
        return Results.NoContent();
    }
}
