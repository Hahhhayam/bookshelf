using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record PurchaseOrderLineDto(Guid Book, int Quantity, MoneyDto PurchasePrice);

public sealed record CreatePurchaseOrderRequest(Guid Supplier, DateOnly ExpectedDate, PurchaseOrderLineDto[] Lines);

public sealed record ReceiveDeliveryRequest(Guid Location, Guid? PurchaseOrder, Guid? Supplier, ItemQuantityDto[] Received);

public sealed record RecordMissingBookRequest(string Title, string? Author, Guid Location, Guid? Customer);

public sealed record SupplierRequest(string Name, string? ContactInfo);

[ApiController]
public sealed class PurchasingController : ControllerBase
{
    [RequirePermission(Permissions.PurchasingManage)]
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

    [RequirePermission(Permissions.PurchasingManage)]
    [HttpPost("purchase-orders/{id:guid}/send")]
    public async Task<IActionResult> SendOrder(Guid id, [FromServices] SendPurchaseOrderUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new PurchaseOrderId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.ReceivingConfirm)]
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

    [RequirePermission(Permissions.SalesCreate)]
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

    [RequirePermission(Permissions.PurchasingManage)]
    [HttpPost("suppliers")]
    public async Task<IActionResult> CreateSupplier(
        SupplierRequest request, [FromServices] CreateSupplierUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Name, request.ContactInfo, ct);
        return Created($"suppliers/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.PurchasingManage)]
    [HttpPut("suppliers/{id:guid}")]
    public async Task<IActionResult> UpdateSupplier(
        Guid id, SupplierRequest request, [FromServices] UpdateSupplierUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SupplierId(id), request.Name, request.ContactInfo, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.PurchasingManage)]
    [HttpPut("suppliers/{id:guid}/active")]
    public async Task<IActionResult> SetSupplierActive(
        Guid id, SetActiveRequest request, [FromServices] SetSupplierActiveUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SupplierId(id), request.Active, ct);
        return NoContent();
    }
}
