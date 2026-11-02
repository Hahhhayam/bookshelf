namespace Application.Inventory;

public sealed class ReleaseReservationUseCase(StockItemLoader stock, ICurrentUser user, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(LocationId location, BookId book, ReservationId reservation, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        user.RequireAccess(location);

        var item = await stock.RequireAsync(location, book, ct);
        item.ReleaseReservation(reservation);
        await unitOfWork.CommitAsync(ct);
    }
}
