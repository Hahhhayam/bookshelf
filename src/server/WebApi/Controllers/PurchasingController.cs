using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;

namespace WebApi.Controllers;

public sealed record PurchaseOrderLineDto(Guid Book, int Quantity, MoneyDto PurchasePrice);

public sealed record CreatePurchaseOrderRequest(Guid Supplier, DateOnly ExpectedDate, PurchaseOrderLineDto[] Lines);

public sealed record ReceiveDeliveryRequest(Guid Location, Guid? PurchaseOrder, Guid? Supplier, ItemQuantityDto[] Received);

public sealed record RecordMissingBookRequest(string Title, string? Author, Guid Location, Guid? Customer);

[ApiController]
public sealed class PurchasingController : ControllerBase
{
    [HttpPost("purchase-orders")]
    public async Task<IActionResult> CreateOrder(
        CreatePurchaseOrderRequest request, [FromServices] CreatePurchaseOrderUseCase useCase, CancellationToken ct)
    {
        var lines = request.Lines
            .Select(l => new PurchaseOrderLineRequest(new BookId(l.Book), new Quantity(l.Quantity), l.PurchasePrice.ToMoney()))
            .ToList();
        var id = await useCase.ExecuteAsync(new CreatePurchaseOrderCommand(new SupplierId(request.Supplier), request.ExpectedDate, lines), ct);
        return Created($"purchase-orders/{id.Value}", new { id = id.Value });
    }

    [HttpPost("purchase-orders/{id:guid}/send")]
    public async Task<IActionResult> SendOrder(Guid id, [FromServices] SendPurchaseOrderUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new PurchaseOrderId(id), ct);
        return NoContent();
    }

    [HttpPost("deliveries")]
    public async Task<IActionResult> ReceiveDelivery(
        ReceiveDeliveryRequest request, [FromServices] ReceiveDeliveryUseCase useCase, CancellationToken ct)
    {
        var command = new ReceiveDeliveryCommand(
            new LocationId(request.Location),
            request.PurchaseOrder is { } order ? new PurchaseOrderId(order) : null,
            request.Supplier is { } supplier ? new SupplierId(supplier) : null,
            request.Received.Select(i => i.ToItem()).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"deliveries/{id.Value}", new { id = id.Value });
    }

    [HttpPost("missing-book-requests")]
    public async Task<IActionResult> RecordMissingBook(
        RecordMissingBookRequest request, [FromServices] RecordMissingBookUseCase useCase, CancellationToken ct)
    {
        var command = new RecordMissingBookCommand(
            request.Title, request.Author, new LocationId(request.Location),
            request.Customer is { } customer ? new CustomerId(customer) : null);
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"missing-book-requests/{id.Value}", new { id = id.Value });
    }
}
