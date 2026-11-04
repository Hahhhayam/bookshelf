using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public sealed record AdjustStockRequest(Guid Location, Guid Book, int NewOnHand, string Reason);

public sealed record ReserveBookRequest(Guid Location, Guid Book, int Quantity, int HoldMinutes);

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

    [HttpDelete("locations/{location:guid}/stock/{book:guid}/reservations/{reservation:guid}")]
    public async Task<IActionResult> Release(
        Guid location, Guid book, Guid reservation, [FromServices] ReleaseReservationUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new LocationId(location), new BookId(book), new ReservationId(reservation), ct);
        return NoContent();
    }

    [HttpPost("transfers")]
    public async Task<IActionResult> CreateTransfer(
        CreateTransferRequest request, [FromServices] CreateTransferUseCase useCase, CancellationToken ct)
    {
        var route = new Domain.Inventory.Route(new LocationId(request.From), new LocationId(request.To));
        var id = await useCase.ExecuteAsync(new CreateTransferCommand(route, request.Items.Select(i => i.ToItem()).ToList()), ct);
        return Created($"transfers/{id.Value}", new { id = id.Value });
    }

    [HttpPost("transfers/{id:guid}/approve")]
    public async Task<IActionResult> ApproveTransfer(Guid id, [FromServices] ApproveTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), ct);
        return NoContent();
    }

    [HttpPost("transfers/{id:guid}/ship")]
    public async Task<IActionResult> ShipTransfer(Guid id, [FromServices] ShipTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), ct);
        return NoContent();
    }

    [HttpPost("transfers/{id:guid}/receive")]
    public async Task<IActionResult> ReceiveTransfer(
        Guid id, ReceiveTransferRequest request, [FromServices] ReceiveTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), request.Received.Select(i => i.ToItem()).ToList(), ct);
        return NoContent();
    }

    [HttpPost("inventory-counts")]
    public async Task<IActionResult> StartCount(
        StartInventoryCountRequest request, [FromServices] StartInventoryCountUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(new LocationId(request.Location), ct);
        return Created($"inventory-counts/{id.Value}", new { id = id.Value });
    }

    [HttpPut("inventory-counts/{id:guid}/lines/{book:guid}")]
    public async Task<IActionResult> RecordCount(
        Guid id, Guid book, RecordCountRequest request, [FromServices] RecordCountedQuantityUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), new BookId(book), new Quantity(request.Counted), ct);
        return NoContent();
    }

    [HttpPost("inventory-counts/{id:guid}/complete")]
    public async Task<IActionResult> CompleteCount(
        Guid id, [FromServices] CompleteInventoryCountUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), ct);
        return NoContent();
    }

    [HttpPost("inventory-counts/{id:guid}/approve")]
    public async Task<IActionResult> ApproveCount(
        Guid id, [FromServices] ApproveInventoryCountUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), ct);
        return NoContent();
    }

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
