namespace Application.Orders;

/// <param name="StockLocation">The store or warehouse whose stock is reserved for the order.</param>
public sealed record PlaceOrderCommand(
    CustomerId Customer, OrderType Type, FulfilmentMethod Fulfilment, LocationId StockLocation);
