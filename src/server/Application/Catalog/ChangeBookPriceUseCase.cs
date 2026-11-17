namespace Application.Catalog;

/// <param name="EffectiveFrom">When the new price starts; absent or already passed means at once.</param>
public sealed record ChangeBookPriceCommand(BookId Book, Money NewPrice, DateTimeOffset? EffectiveFrom = null);

/// <summary>
/// Scenario 3.3. The history entry, audit record and cache refresh follow from the PriceChanged event, which a
/// scheduled price raises only when its moment comes (<see cref="ApplyScheduledPricesUseCase"/>).
/// </summary>
public sealed class ChangeBookPriceUseCase(
    IBookRepository books, IScheduledPriceRepository scheduledPrices, ICurrentUser user, AuditTrail audit, IClock clock,
    IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(ChangeBookPriceCommand command, CancellationToken ct)
    {
        user.Require(Permissions.PriceChange);
        var book = await books.GetAsync(command.Book, ct).OrNotFound("Book");

        var now = clock.Now;
        if (command.EffectiveFrom is { } from && from > now)
            await ScheduleAsync(book, command.NewPrice, from, now, ct);
        else
            book.ChangePrice(command.NewPrice, user.Id, now);
        await unitOfWork.CommitAsync(ct);
    }

    private async Task ScheduleAsync(Book book, Money price, DateTimeOffset from, DateTimeOffset now, CancellationToken ct)
    {
        if (await scheduledPrices.FindAsync(book.Id, ct) is { } existing)
            existing.Replace(price, from, user.Id, now);
        else
            scheduledPrices.Add(ScheduledPrice.Schedule(book.Id, price, from, user.Id, now));
        audit.Record("book.price-scheduled", book.Id.ToString(),
            new FieldChange("price", book.Price.ToString(), price.ToString()), FieldChange.Set("effectiveFrom", from.ToString("O")));
    }
}
