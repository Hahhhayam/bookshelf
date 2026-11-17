namespace Application.Catalog;

/// <summary>Background job: puts scheduled prices into effect once their moment has come.</summary>
public sealed class ApplyScheduledPricesUseCase(
    IScheduledPriceRepository scheduledPrices, IBookRepository books, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(CancellationToken ct)
    {
        foreach (var price in await scheduledPrices.ListDueAsync(clock.Now, ct))
        {
            if (await books.GetAsync(price.Id, ct) is { } book)
                price.ApplyTo(book);
            scheduledPrices.Remove(price);
        }
        await unitOfWork.CommitAsync(ct);
    }
}
