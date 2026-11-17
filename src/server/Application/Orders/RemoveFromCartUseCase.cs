namespace Application.Orders;

/// <summary>Called by the online-shop adapter.</summary>
public sealed class RemoveFromCartUseCase(ICartRepository carts, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CustomerId customer, BookId book, CancellationToken ct)
    {
        var cart = await carts.FindByCustomerAsync(customer, ct).OrNotFound("Cart");
        cart.Remove(book);
        await unitOfWork.CommitAsync(ct);
    }
}
