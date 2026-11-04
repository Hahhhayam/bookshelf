namespace WebApi.Endpoints;

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

internal static class InventoryEndpoints
{
    public static void MapInventoryEndpoints(this IEndpointRouteBuilder app)
    {
        MapStock(app);
        MapTransfers(app.MapGroup("/transfers"));
        MapCounts(app.MapGroup("/inventory-counts"));
        app.MapPost("/write-offs", CreateWriteOffAsync);
    }

    private static void MapStock(IEndpointRouteBuilder app)
    {
        app.MapPost("/stock/adjustments", AdjustAsync);
        app.MapPost("/stock/reservations", ReserveAsync);
        app.MapDelete("/locations/{location:guid}/stock/{book:guid}/reservations/{reservation:guid}", ReleaseAsync);
    }

    private static void MapTransfers(RouteGroupBuilder transfers)
    {
        transfers.MapPost("/", CreateTransferAsync);
        transfers.MapPost("/{id:guid}/approve", ApproveTransferAsync);
        transfers.MapPost("/{id:guid}/ship", ShipTransferAsync);
        transfers.MapPost("/{id:guid}/receive", ReceiveTransferAsync);
    }

    private static void MapCounts(RouteGroupBuilder counts)
    {
        counts.MapPost("/", StartCountAsync);
        counts.MapPut("/{id:guid}/lines/{book:guid}", RecordCountAsync);
        counts.MapPost("/{id:guid}/complete", CompleteCountAsync);
        counts.MapPost("/{id:guid}/approve", ApproveCountAsync);
    }

    private static async Task<IResult> AdjustAsync(AdjustStockRequest request, AdjustStockUseCase useCase, CancellationToken ct)
    {
        var command = new AdjustStockCommand(
            new LocationId(request.Location), new BookId(request.Book), new Quantity(request.NewOnHand),
            new AdjustmentReason(request.Reason));
        await useCase.ExecuteAsync(command, ct);
        return Results.NoContent();
    }

    private static async Task<IResult> ReserveAsync(ReserveBookRequest request, ReserveBookUseCase useCase, CancellationToken ct)
    {
        var command = new ReserveBookCommand(
            new LocationId(request.Location), new BookId(request.Book), new Quantity(request.Quantity),
            TimeSpan.FromMinutes(request.HoldMinutes));
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Ok(new { id = id.Value });
    }

    private static async Task<IResult> ReleaseAsync(
        Guid location, Guid book, Guid reservation, ReleaseReservationUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new LocationId(location), new BookId(book), new ReservationId(reservation), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> CreateTransferAsync(
        CreateTransferRequest request, CreateTransferUseCase useCase, CancellationToken ct)
    {
        var route = new Domain.Inventory.Route(new LocationId(request.From), new LocationId(request.To));
        var id = await useCase.ExecuteAsync(new CreateTransferCommand(route, request.Items.Select(i => i.ToItem()).ToList()), ct);
        return Results.Created($"/transfers/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> ApproveTransferAsync(Guid id, ApproveTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> ShipTransferAsync(Guid id, ShipTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> ReceiveTransferAsync(
        Guid id, ReceiveTransferRequest request, ReceiveTransferUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new TransferId(id), request.Received.Select(i => i.ToItem()).ToList(), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> StartCountAsync(
        StartInventoryCountRequest request, StartInventoryCountUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(new LocationId(request.Location), ct);
        return Results.Created($"/inventory-counts/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> RecordCountAsync(
        Guid id, Guid book, RecordCountRequest request, RecordCountedQuantityUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), new BookId(book), new Quantity(request.Counted), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> CompleteCountAsync(Guid id, CompleteInventoryCountUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> ApproveCountAsync(Guid id, ApproveInventoryCountUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new InventoryCountId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> CreateWriteOffAsync(
        CreateWriteOffRequest request, CreateWriteOffUseCase useCase, CancellationToken ct)
    {
        var command = new CreateWriteOffCommand(
            new LocationId(request.Location), new WriteOffReason(request.Reason), request.Items.Select(i => i.ToItem()).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/write-offs/{id.Value}", new { id = id.Value });
    }
}
