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

    [RequirePermission(Permissions.PurchasingManage, Permissions.ReceivingConfirm)]
    [HttpGet("purchase-orders/{id:guid}")]
    public async Task<IActionResult> GetOrder(Guid id, [FromServices] GetPurchaseOrderUseCase useCase, CancellationToken ct)
    {
        var (order, history, isOverdue) = await useCase.ExecuteAsync(new PurchaseOrderId(id), ct);
        return Ok(new
        {
            id = order.Id.Value, supplier = order.SupplierId.Value, order.Status, order.ExpectedDate, isOverdue,
            lines = order.Lines.Select(l => new
            {
                book = l.Id.Value, ordered = l.Ordered.Value, received = l.Received.Value,
                purchasePrice = MoneyDto.From(l.PurchasePrice),
            }),
            history = history.Select(c => new { c.From, c.To, c.At, by = c.By.Value }),
        });
    }

    [RequirePermission(Permissions.PurchasingManage, Permissions.ReceivingConfirm)]
    [HttpGet("purchase-orders")]
    public async Task<IActionResult> ListOrders(
        PurchaseOrderStatus? status, bool overdue, [FromServices] ListPurchaseOrdersUseCase useCase, CancellationToken ct)
    {
        var orders = await useCase.ExecuteAsync(status, overdue, ct);
        return Ok(orders.Select(o => new
        {
            id = o.Order.Value, supplier = o.Supplier.Value, o.Status, o.ExpectedDate, o.IsOverdue, o.LastChangedAt,
            lastChangedBy = o.LastChangedBy?.Value,
        }));
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
