namespace Application.Orders;

/// <summary>Called by the online-shop adapter. A quantity of zero removes the line.</summary>
public sealed class ChangeCartQuantityUseCase(ICartRepository carts, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CustomerId customer, BookId book, Quantity quantity, CancellationToken ct)
    {
        var cart = await carts.FindByCustomerAsync(customer, ct).OrNotFound("Cart");
        cart.SetQuantity(book, quantity);
        await unitOfWork.CommitAsync(ct);
    }
}
