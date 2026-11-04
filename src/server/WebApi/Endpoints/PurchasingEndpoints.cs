using WebApi.Contracts;

namespace WebApi.Endpoints;

public sealed record PurchaseOrderLineDto(Guid Book, int Quantity, MoneyDto PurchasePrice);

public sealed record CreatePurchaseOrderRequest(Guid Supplier, DateOnly ExpectedDate, PurchaseOrderLineDto[] Lines);

public sealed record ReceiveDeliveryRequest(Guid Location, Guid? PurchaseOrder, Guid? Supplier, ItemQuantityDto[] Received);

public sealed record RecordMissingBookRequest(string Title, string? Author, Guid Location, Guid? Customer);

internal static class PurchasingEndpoints
{
    public static void MapPurchasingEndpoints(this IEndpointRouteBuilder app)
    {
        var orders = app.MapGroup("/purchase-orders");
        orders.MapPost("/", CreateOrderAsync);
        orders.MapPost("/{id:guid}/send", SendOrderAsync);
        app.MapPost("/deliveries", ReceiveDeliveryAsync);
        app.MapPost("/missing-book-requests", RecordMissingBookAsync);
    }

    private static async Task<IResult> CreateOrderAsync(
        CreatePurchaseOrderRequest request, CreatePurchaseOrderUseCase useCase, CancellationToken ct)
    {
        var lines = request.Lines
            .Select(l => new PurchaseOrderLineRequest(new BookId(l.Book), new Quantity(l.Quantity), l.PurchasePrice.ToMoney()))
            .ToList();
        var id = await useCase.ExecuteAsync(new CreatePurchaseOrderCommand(new SupplierId(request.Supplier), request.ExpectedDate, lines), ct);
        return Results.Created($"/purchase-orders/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> SendOrderAsync(Guid id, SendPurchaseOrderUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new PurchaseOrderId(id), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> ReceiveDeliveryAsync(
        ReceiveDeliveryRequest request, ReceiveDeliveryUseCase useCase, CancellationToken ct)
    {
        var command = new ReceiveDeliveryCommand(
            new LocationId(request.Location),
            request.PurchaseOrder is { } order ? new PurchaseOrderId(order) : null,
            request.Supplier is { } supplier ? new SupplierId(supplier) : null,
            request.Received.Select(i => i.ToItem()).ToList());
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/deliveries/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> RecordMissingBookAsync(
        RecordMissingBookRequest request, RecordMissingBookUseCase useCase, CancellationToken ct)
    {
        var command = new RecordMissingBookCommand(
            request.Title, request.Author, new LocationId(request.Location),
            request.Customer is { } customer ? new CustomerId(customer) : null);
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/missing-book-requests/{id.Value}", new { id = id.Value });
    }
}
