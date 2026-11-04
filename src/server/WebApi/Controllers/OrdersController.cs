using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public sealed record AddToCartRequest(Guid Book, int Quantity);

public sealed record FulfilmentDto(FulfilmentKind Kind, Guid? PickupLocation, string? DeliveryAddress);

public sealed record PlaceOrderRequest(Guid Customer, OrderType Type, FulfilmentDto Fulfilment, Guid StockLocation);

public sealed record ChangeOrderStatusRequest(OrderStatus Status);

[ApiController]
public sealed class OrdersController : ControllerBase
{
    [HttpPost("customers/{customer:guid}/cart/items")]
    public async Task<IActionResult> AddToCart(
        Guid customer, AddToCartRequest request, [FromServices] AddToCartUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(customer), new BookId(request.Book), new Quantity(request.Quantity), ct);
        return NoContent();
    }

    [HttpPost("orders")]
    public async Task<IActionResult> Place(
        PlaceOrderRequest request, [FromServices] PlaceOrderUseCase useCase, CancellationToken ct)
    {
        var command = new PlaceOrderCommand(
            new CustomerId(request.Customer), request.Type, ToFulfilment(request.Fulfilment), new LocationId(request.StockLocation));
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"orders/{id.Value}", new { id = id.Value });
    }

    [HttpPost("orders/{id:guid}/status")]
    public async Task<IActionResult> ChangeStatus(
        Guid id, ChangeOrderStatusRequest request, [FromServices] ChangeOrderStatusUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new OrderId(id), request.Status, ct);
        return NoContent();
    }

    private static FulfilmentMethod ToFulfilment(FulfilmentDto dto) => dto.Kind switch
    {
        FulfilmentKind.Pickup => FulfilmentMethod.Pickup(new LocationId(
            dto.PickupLocation ?? throw new DomainException("A pickup order needs a pickup location."))),
        _ => FulfilmentMethod.Delivery(
            dto.DeliveryAddress ?? throw new DomainException("A delivery order needs an address.")),
    };
}
