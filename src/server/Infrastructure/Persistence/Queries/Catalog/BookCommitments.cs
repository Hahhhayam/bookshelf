using Application.Catalog;
using Domain.Inventory;
using Domain.Orders;
using Domain.Purchasing;

namespace Infrastructure.Persistence.Queries.Catalog;

internal sealed class BookCommitments(BookstoreDbContext db) : IBookCommitments
{
    private static readonly OrderStatus[] FinishedOrders = [OrderStatus.Issued, OrderStatus.Cancelled];
    private static readonly PurchaseOrderStatus[] AwaitingDelivery = [PurchaseOrderStatus.Sent, PurchaseOrderStatus.PartlyReceived];

    public async Task<bool> ExistAsync(BookId book, CancellationToken ct) =>
        await HasActiveReservationAsync(book, ct) ||
        await HasOpenOrderAsync(book, ct) ||
        await HasUndeliveredPurchaseAsync(book, ct);

    private Task<bool> HasActiveReservationAsync(BookId book, CancellationToken ct) =>
        db.Set<StockItem>()
            .Where(s => s.BookId == book)
            .AnyAsync(s => s.Reservations.Any(r => r.Status == ReservationStatus.Active), ct);

    private Task<bool> HasOpenOrderAsync(BookId book, CancellationToken ct) =>
        db.Set<Order>()
            .Where(o => !FinishedOrders.Contains(o.Status))
            .AnyAsync(o => o.Lines.Any(l => l.Id == book), ct);

    private Task<bool> HasUndeliveredPurchaseAsync(BookId book, CancellationToken ct) =>
        db.Set<PurchaseOrder>()
            .Where(o => AwaitingDelivery.Contains(o.Status))
            .AnyAsync(o => o.Lines.Any(l => l.Id == book), ct);
}
