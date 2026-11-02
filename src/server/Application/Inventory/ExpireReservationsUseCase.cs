namespace Application.Inventory;

/// <summary>Background job: ends holds whose time ran out so the goods become available again.</summary>
public sealed class ExpireReservationsUseCase(IStockItemRepository stockItems, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CancellationToken ct)
    {
        var now = clock.Now;
        foreach (var item in await stockItems.ListWithExpiredReservationsAsync(now, ct))
            item.ExpireReservations(now);
        await unitOfWork.CommitAsync(ct);
    }
}
