namespace Application.Orders;

/// <summary>Called by the online-shop adapter, which authenticates the customer.</summary>
public sealed class AddToCartUseCase(ICartRepository carts, ICustomerRepository customers, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CustomerId customer, BookId book, Quantity quantity, CancellationToken ct)
    {
        await customers.GetAsync(customer, ct).OrNotFound("Customer");
        var cart = await carts.FindByCustomerAsync(customer, ct) ?? OpenCart(customer);
        cart.Add(book, quantity);
        await unitOfWork.CommitAsync(ct);
    }

    private Cart OpenCart(CustomerId customer)
    {
        var cart = Cart.Create(customer);
        carts.Add(cart);
        return cart;
    }
}
