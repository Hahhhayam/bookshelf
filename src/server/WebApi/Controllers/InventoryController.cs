using Microsoft.AspNetCore.Mvc;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record AdjustStockRequest(Guid Location, Guid Book, int NewOnHand, string Reason);

public sealed record ReserveBookRequest(Guid Location, Guid Book, int Quantity, int HoldMinutes);

public sealed record SetMinimumStockRequest(int Minimum);

public sealed record ItemQuantityDto(Guid Book, int Quantity)
{
    public ItemQuantity ToItem() => new(new BookId(Book), new Quantity(Quantity));
}

public sealed record CreateTransferRequest(Guid From, Guid To, ItemQuantityDto[] Items);

public sealed record ReceiveTransferRequest(ItemQuantityDto[] Received);

public sealed record StartInventoryCountRequest(Guid Location);

public sealed record RecordCountRequest(int Counted);

public sealed record CreateWriteOffRequest(Guid Location, string Reason, ItemQuantityDto[] Items);

[ApiController]
public sealed class InventoryController : ControllerBase
{
    [RequirePermission(Permissions.StockAdjust)]
    [HttpPost("stock/adjustments")]
    public async Task<IActionResult> Adjust(
        AdjustStockRequest request, [FromServices] AdjustStockUseCase useCase, CancellationToken ct)
    {
        var command = new AdjustStockCommand(
            new LocationId(request.Location), new BookId(request.Book), new Quantity(request.NewOnHand),
            new AdjustmentReason(request.Reason));
        await useCase.ExecuteAsync(command, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.SalesCreate, Permissions.StockAdjust, Permissions.TransfersManage,
        Permissions.InventoryCountManage, Permissions.ReceivingConfirm, Permissions.PurchasingManage)]
    [HttpGet("locations/{location:guid}/stock")]
    public async Task<IActionResult> Stock(
        Guid location, Guid? book, bool belowMinimum, [FromServices] GetLocationStockUseCase useCase, CancellationToken ct)
    {
        var lines = await useCase.ExecuteAsync(
            new LocationId(location), book is { } b ? new BookId(b) : null, belowMinimum, ct);
        return Ok(lines.Select(l => new
        {
            book = l.Book.Value, onHand = l.OnHand.Value, reserved = l.Reserved.Value, available = l.Available.Value,
            minimum = l.Minimum.Value, l.BelowMinimum,
        }));
    }

    [RequirePermission(Permissions.TransfersManage)]
    [HttpGet("transfers/{id:guid}")]
    public async Task<IActionResult> GetTransfer(Guid id, [FromServices] GetTransferUseCase useCase, CancellationToken ct)
    {
        var (transfer, history) = await useCase.ExecuteAsync(new TransferId(id), ct);
        return Ok(new
        {
            id = transfer.Id.Value, from = transfer.Route.From.Value, to = transfer.Route.To.Value, transfer.Status,
            shippedBy = transfer.ShippedBy?.Value, receivedBy = transfer.ReceivedBy?.Value,
            lines = transfer.Lines.Select(l => new
            {
                book = l.Id.Value, shipped = l.Shipped.Value, received = l.Received?.Value,
            }),
            discrepancies = transfer.Discrepancies.Select(d => new
            {
                id = d.Id, book = d.BookId.Value, expected = d.Expected.Value, actual = d.Actual.Value, d.IsResolved,
            }),
            history = history.Select(c => new { c.From, c.To, c.At, by = c.By.Value }),
        });
    }

    [RequirePermission(Permissions.TransfersManage)]
    [HttpGet("locations/{location:guid}/transfers")]
    public async Task<IActionResult> ListTransfers(
        Guid location, TransferStatus? status, [FromServices] ListTransfersUseCase useCase, CancellationToken ct)
    {
        var transfers = await useCase.ExecuteAsync(new LocationId(location), status, ct);
        return Ok(transfers.Select(t => new
        {
            id = t.Transfer.Value, from = t.Route.From.Value, to = t.Route.To.Value, t.Status, t.HasOpenDiscrepancies,
            t.LastChangedAt, lastChangedBy = t.LastChangedBy?.Value,
        }));
    }

    [RequirePermission(Permissions.StockAdjust)]
    [HttpPut("locations/{location:guid}/stock/{book:guid}/minimum")]
    public async Task<IActionResult> SetMinimum(
        Guid location, Guid book, SetMinimumStockRequest request, [FromServices] SetMinimumStockUseCase useCase,
        CancellationToken ct)
    {
        var command = new SetMinimumStockCommand(new LocationId(location), new BookId(book), new Quantity(request.Minimum));
        await useCase.ExecuteAsync(command, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.SalesCreate)]
    [HttpPost("stock/reservations")]
    public async Task<IActionResult> Reserve(
        ReserveBookRequest request, [FromServices] ReserveBookUseCase useCase, CancellationToken ct)
    {
        var command = new ReserveBookCommand(
            new LocationId(request.Location), new BookId(request.Book), new Quantity(request.Quantity),
            TimeSpan.FromMinutes(request.HoldMinutes));
        var id = await useCase.ExecuteAsync(command, ct);
        return Ok(new { id = id.Value });
    }

    [RequirePermission(Permissions.SalesCreate)]
    [HttpDelete("locations/{location:guid}/stock/{book:guid}/reservations/{reservation:guid}")]
    public async Task<IActionResult> Release(
        Guid location, Guid book, Guid reservation, [FromServices] ReleaseReservationUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new LocationId(location), new BookId(book), new ReservationId(reservation), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.TransfersManage)]
    [HttpPost("transfers")]
    public async Task<IActionResult> CreateTransfer(
        CreateTransferRequest request, [FromServices] CreateTransferUseCase useCase, CancellationToken ct)
    {
        var route = new Domain.Inventory.Route(new LocationId(request.From), new LocationId(request.To));
        var id = await useCase.ExecuteAsync(new CreateTransferCommand(route, request.Items.Select(i => i.ToItem()).ToList()), ct);
        return Created($"transfers/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.TransfersManage)]
    [HttpPost("transfers/{id:guid}/approve")]
    public async Task<IActionResult> ApproveTransfer(Guid id, [FromServices] ApproveTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.TransfersManage)]
    [HttpPost("transfers/{id:guid}/ship")]
    public async Task<IActionResult> ShipTransfer(Guid id, [FromServices] ShipTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.TransfersManage)]
    [HttpPost("transfers/{id:guid}/receive")]
    public async Task<IActionResult> ReceiveTransfer(
        Guid id, ReceiveTransferRequest request, [FromServices] ReceiveTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), request.Received.Select(i => i.ToItem()).ToList(), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.InventoryCountManage)]
    [HttpPost("inventory-counts")]
    public async Task<IActionResult> StartCount(
        StartInventoryCountRequest request, [FromServices] StartInventoryCountUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(new LocationId(request.Location), ct);
        return Created($"inventory-counts/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.InventoryCountManage)]
    [HttpPut("inventory-counts/{id:guid}/lines/{book:guid}")]
    public async Task<IActionResult> RecordCount(
        Guid id, Guid book, RecordCountRequest request, [FromServices] RecordCountedQuantityUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), new BookId(book), new Quantity(request.Counted), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.InventoryCountManage)]
    [HttpPost("inventory-counts/{id:guid}/complete")]
    public async Task<IActionResult> CompleteCount(
        Guid id, [FromServices] CompleteInventoryCountUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.InventoryCountApprove)]
    [HttpPost("inventory-counts/{id:guid}/approve")]
    public async Task<IActionResult> ApproveCount(
        Guid id, [FromServices] ApproveInventoryCountUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.WriteOffCreate)]
    [HttpPost("write-offs")]
    public async Task<IActionResult> CreateWriteOff(
        CreateWriteOffRequest request, [FromServices] CreateWriteOffUseCase useCase, CancellationToken ct)
    {
        var command = new CreateWriteOffCommand(
            new LocationId(request.Location), new WriteOffReason(request.Reason), request.Items.Select(i => i.ToItem()).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"write-offs/{id.Value}", new { id = id.Value });
    }
}
