namespace Application.Inventory;

public sealed record ReserveBookCommand(LocationId Location, BookId Book, Quantity Quantity, TimeSpan HoldFor);

/// <summary>FR-06: holds a quantity for a customer for a defined time.</summary>
public sealed class ReserveBookUseCase(StockItemLoader stock, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<ReservationId> ExecuteAsync(ReserveBookCommand command, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        user.RequireAccess(command.Location);

        var item = await stock.RequireAsync(command.Location, command.Book, ct);
        var reservation = item.Reserve(command.Quantity, ReservationPurpose.CustomerOrder,
            Guid.CreateVersion7(), clock.Now + command.HoldFor);
        await unitOfWork.CommitAsync(ct);
        return reservation;
    }
}
