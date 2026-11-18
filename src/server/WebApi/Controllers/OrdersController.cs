using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record AddToCartRequest(Guid Book, int Quantity);

public sealed record ChangeCartQuantityRequest(int Quantity);

public sealed record FulfilmentDto(FulfilmentKind Kind, Guid? PickupLocation, string? DeliveryAddress);

public sealed record PlaceOrderRequest(Guid Customer, OrderType Type, FulfilmentDto Fulfilment, Guid StockLocation);

public sealed record ChangeOrderStatusRequest(OrderStatus Status);

[ApiController]
public sealed class OrdersController : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("customers/{customer:guid}/cart/items")]
    public async Task<IActionResult> AddToCart(
        Guid customer, AddToCartRequest request, [FromServices] AddToCartUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(customer), new BookId(request.Book), new Quantity(request.Quantity), ct);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpGet("customers/{customer:guid}/cart")]
    public async Task<IActionResult> GetCart(Guid customer, [FromServices] GetCartUseCase useCase, CancellationToken ct)
    {
        var cart = await useCase.ExecuteAsync(new CustomerId(customer), ct);
        return Ok(new
        {
            lines = cart.Lines.Select(l => new
            {
                book = l.Book.Value, l.Title, quantity = l.Quantity.Value, unitPrice = MoneyDto.From(l.UnitPrice),
            }),
            total = cart.Total is { } sum ? MoneyDto.From(sum) : null,
        });
    }

    [AllowAnonymous]
    [HttpPut("customers/{customer:guid}/cart/items/{book:guid}")]
    public async Task<IActionResult> ChangeCartQuantity(
        Guid customer, Guid book, ChangeCartQuantityRequest request, [FromServices] ChangeCartQuantityUseCase useCase,
        CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(customer), new BookId(book), new Quantity(request.Quantity), ct);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpDelete("customers/{customer:guid}/cart/items/{book:guid}")]
    public async Task<IActionResult> RemoveFromCart(
        Guid customer, Guid book, [FromServices] RemoveFromCartUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(customer), new BookId(book), ct);
        return NoContent();
    }

    [AllowAnonymous]
    [HttpPost("orders")]
    public async Task<IActionResult> Place(
        PlaceOrderRequest request, [FromServices] PlaceOrderUseCase useCase, CancellationToken ct)
    {
        var command = new PlaceOrderCommand(
            new CustomerId(request.Customer), request.Type, ToFulfilment(request.Fulfilment), new LocationId(request.StockLocation));
        var placed = await useCase.ExecuteAsync(command, ct);
        return Created($"orders/{placed.Order.Value}", new { id = placed.Order.Value, pickupCode = placed.PickupCode.Value });
    }

    [AllowAnonymous]
    [HttpGet("customers/{customer:guid}/orders")]
    public async Task<IActionResult> ListCustomerOrders(
        Guid customer, [FromServices] ListCustomerOrdersUseCase useCase, CancellationToken ct)
    {
        var views = await useCase.ExecuteAsync(new CustomerId(customer), ct);
        return Ok(views.Select(v => new
        {
            id = v.Order.Id.Value, pickupCode = v.Order.PickupCode.Value, v.Order.Status, v.Order.Fulfilment.Kind,
            store = v.Order.Fulfilment.PickupLocation?.Value, total = MoneyDto.From(v.Order.Total),
            quantity = v.Order.Lines.Sum(l => l.Quantity.Value),
        }));
    }

    [AllowAnonymous]
    [HttpGet("orders/track/{code}")]
    public async Task<IActionResult> Track(string code, [FromServices] TrackOrderUseCase useCase, CancellationToken ct)
    {
        var (order, history) = await useCase.ExecuteAsync(new PickupCode(code), ct);
        return Ok(new
        {
            id = order.Id.Value, order.Status, order.Fulfilment.Kind, store = order.Fulfilment.PickupLocation?.Value,
            total = MoneyDto.From(order.Total),
            lines = order.Lines.Select(l => new
            {
                book = l.Id.Value, quantity = l.Quantity.Value, unitPrice = MoneyDto.From(l.UnitPrice),
            }),
            history = history.Select(c => new { c.To, c.At }),
        });
    }

    [RequirePermission(Permissions.OrdersManage)]
    [HttpGet("orders/{id:guid}")]
    public async Task<IActionResult> Get(Guid id, [FromServices] GetOrderUseCase useCase, CancellationToken ct)
    {
        var (order, history) = await useCase.ExecuteAsync(new OrderId(id), ct);
        return Ok(new
        {
            id = order.Id.Value, customer = order.CustomerId.Value, order.Type, order.Status,
            stockLocation = order.StockLocation.Value, pickupCode = order.PickupCode.Value,
            fulfilment = new
            {
                order.Fulfilment.Kind, pickupLocation = order.Fulfilment.PickupLocation?.Value,
                order.Fulfilment.DeliveryAddress,
            },
            total = MoneyDto.From(order.Total),
            lines = order.Lines.Select(l => new
            {
                book = l.Id.Value, quantity = l.Quantity.Value, unitPrice = MoneyDto.From(l.UnitPrice),
            }),
            history = history.Select(c => new { c.From, c.To, c.At, by = c.By.Value }),
        });
    }

    [RequirePermission(Permissions.OrdersManage)]
    [HttpGet("locations/{location:guid}/orders")]
    public async Task<IActionResult> List(
        Guid location, OrderStatus? status, string? pickupCode, [FromServices] ListOrdersUseCase useCase,
        CancellationToken ct)
    {
        var code = string.IsNullOrWhiteSpace(pickupCode) ? (PickupCode?)null : new PickupCode(pickupCode);
        var orders = await useCase.ExecuteAsync(new LocationId(location), status, code, ct);
        return Ok(orders.Select(o => new
        {
            id = o.Order.Value, customer = o.Customer.Value, o.Type, o.Status, o.LastChangedAt,
            lastChangedBy = o.LastChangedBy?.Value,
        }));
    }

    [RequirePermission(Permissions.OrdersManage)]
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
            dto.PickupLocation ?? throw new DomainException("pickup-location-required", "A pickup order needs a pickup location."))),
        _ => FulfilmentMethod.Delivery(
            dto.DeliveryAddress ?? throw new DomainException("delivery-address-required", "A delivery order needs an address.")),
    };
}
