using Application.Orders;
using Domain.Orders;

namespace Infrastructure.Persistence.Repositories.Orders;

internal sealed class CartRepository(BookstoreDbContext db) : ICartRepository
{
    public Task<Cart?> FindByCustomerAsync(CustomerId customer, CancellationToken ct) =>
        db.Set<Cart>().FirstOrDefaultAsync(c => c.CustomerId == customer, ct);

    public void Add(Cart cart) => db.Set<Cart>().Add(cart);
}
