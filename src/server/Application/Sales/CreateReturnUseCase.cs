namespace Application.Sales;

public sealed record CreateReturnCommand(
    SaleId Sale, IReadOnlyList<ItemQuantity> Items, ReturnReason Reason, ItemCondition Condition);

/// <summary>Scenario 3.6, steps 1-3: stock and money do not change until the return is confirmed.</summary>
public sealed class CreateReturnUseCase(
    ISaleRepository sales, IReturnRepository returns, IReturnPolicy policy, ICurrentUser user, IClock clock,
    IUnitOfWork unitOfWork)
{
    public async Task<ReturnId> ExecuteAsync(CreateReturnCommand command, CancellationToken ct)
    {
        user.Require(Permissions.ReturnsCreate);
        var sale = await sales.GetAsync(command.Sale, ct).OrNotFound("Sale");
        user.RequireAccess(sale.LocationId);
        Guard.That(clock.Now - sale.CompletedAt <= policy.Window, "The return period has expired.");

        var returnable = await ReturnableQuantitiesAsync(sale, ct);
        var ret = Return.Create(sale, command.Items, returnable, command.Reason, command.Condition);
        returns.Add(ret);
        await unitOfWork.CommitAsync(ct);
        return ret.Id;
    }

    private async Task<IReadOnlyDictionary<BookId, Quantity>> ReturnableQuantitiesAsync(Sale sale, CancellationToken ct)
    {
        var alreadyReturned = await returns.ReturnedQuantitiesAsync(sale.Id, ct);
        return sale.Lines
            .GroupBy(l => l.BookId)
            .ToDictionary(
                g => g.Key,
                g => new Quantity(g.Sum(l => l.Quantity.Value)) - alreadyReturned.GetValueOrDefault(g.Key));
    }
}
