namespace Application.Sales;

public sealed record CompleteSaleCommand(
    LocationId Location, CustomerId? Customer, IdempotencyKey Key,
    IReadOnlyList<SaleItemRequest> Items, IReadOnlyList<PaymentRequest> Payments);

/// <summary>
/// Scenario 3.5. The sale and its stock deduction are one transaction. The card is charged last
/// with a key derived from the operation key, so a retry after a failed commit does not charge twice.
/// </summary>
public sealed class CompleteSaleUseCase(
    ISaleRepository sales, IShiftRepository shifts, SaleLinePricer pricer, SalePaymentSettler settler,
    SaleBonusRedeemer bonusRedeemer, StockItemLoader stock, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task<SaleId> ExecuteAsync(CompleteSaleCommand command, CancellationToken ct)
    {
        user.Require(Permissions.SalesCreate);
        user.RequireAccess(command.Location);
        if (await sales.FindByKeyAsync(command.Key, ct) is { } existing)
            return existing.Id;
        Guard.That(await shifts.FindOpenAsync(command.Location, ct) is not null, "shift-not-open", "The till is closed: no open shift.");

        var now = clock.Now;
        var lines = await pricer.PriceAsync(command.Items, command.Customer, now, ct);
        Sale.EnsurePaymentsCover(Sale.TotalOf(lines), command.Payments.Select(p => p.Amount));
        var stockItems = await stock.RequireManyAsync(command.Location, lines.Select(l => l.BookId), ct);
        StockAvailability.EnsureAvailable(stockItems, lines.Select(l => new ItemQuantity(l.BookId, l.Quantity)));

        var payments = await settler.SettleAsync(command.Payments, command.Key, ct);
        var sale = Sale.Complete(command.Location, user.Id, command.Customer, lines, payments, command.Key, now);
        DeductStock(stockItems, sale, now);
        await bonusRedeemer.RedeemAsync(sale, now, ct);

        sales.Add(sale);
        await unitOfWork.CommitAsync(ct);
        return sale.Id;
    }

    private static void DeductStock(IReadOnlyDictionary<BookId, StockItem> stockItems, Sale sale, DateTimeOffset now)
    {
        foreach (var line in sale.Lines)
            stockItems[line.BookId].Sell(line.Quantity, sale.Id.Value, now);
    }
}
