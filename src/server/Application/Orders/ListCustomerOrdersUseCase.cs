namespace Application.Orders;

/// <summary>
/// Called by the online-shop adapter, like the cart: the customer id is the shop's identity for the buyer, who has no
/// login. Shows the buyer's own orders so they can follow them without remembering each pickup code.
/// </summary>
public sealed class ListCustomerOrdersUseCase(IOrderQueries orders)
{
    public Task<IReadOnlyList<OrderView>> ExecuteAsync(CustomerId customer, CancellationToken ct) =>
        orders.ListForCustomerAsync(customer, ct);
}
