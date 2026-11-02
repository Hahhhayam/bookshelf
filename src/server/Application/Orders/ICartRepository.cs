namespace Application.Orders;

public interface ICartRepository
{
    Task<Cart?> FindByCustomerAsync(CustomerId customer, CancellationToken ct);

    void Add(Cart cart);
}
