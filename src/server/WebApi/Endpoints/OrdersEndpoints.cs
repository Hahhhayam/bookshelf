namespace WebApi.Endpoints;

public sealed record AddToCartRequest(Guid Book, int Quantity);

public sealed record FulfilmentDto(FulfilmentKind Kind, Guid? PickupLocation, string? DeliveryAddress);

public sealed record PlaceOrderRequest(Guid Customer, OrderType Type, FulfilmentDto Fulfilment, Guid StockLocation);

public sealed record ChangeOrderStatusRequest(OrderStatus Status);

internal static class OrdersEndpoints
{
    public static void MapOrdersEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapPost("/customers/{customer:guid}/cart/items", AddToCartAsync);
        app.MapPost("/orders", PlaceAsync);
        app.MapPost("/orders/{id:guid}/status", ChangeStatusAsync);
    }

    private static async Task<IResult> AddToCartAsync(
        Guid customer, AddToCartRequest request, AddToCartUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(customer), new BookId(request.Book), new Quantity(request.Quantity), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> PlaceAsync(PlaceOrderRequest request, PlaceOrderUseCase useCase, CancellationToken ct)
    {
        var command = new PlaceOrderCommand(
            new CustomerId(request.Customer), request.Type, ToFulfilment(request.Fulfilment), new LocationId(request.StockLocation));
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/orders/{id.Value}", new { id = id.Value });
    }

    private static FulfilmentMethod ToFulfilment(FulfilmentDto dto) => dto.Kind switch
    {
        FulfilmentKind.Pickup => FulfilmentMethod.Pickup(new LocationId(
            dto.PickupLocation ?? throw new DomainException("A pickup order needs a pickup location."))),
        _ => FulfilmentMethod.Delivery(
            dto.DeliveryAddress ?? throw new DomainException("A delivery order needs an address.")),
    };

    private static async Task<IResult> ChangeStatusAsync(
        Guid id, ChangeOrderStatusRequest request, ChangeOrderStatusUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new OrderId(id), request.Status, ct);
        return Results.NoContent();
    }
}
