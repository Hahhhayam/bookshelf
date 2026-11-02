namespace Application.Catalog;

public sealed record ChangeBookPriceCommand(BookId Book, Money NewPrice, DateTimeOffset ValidFrom);

/// <summary>Scenario 3.3. The audit record and cache refresh follow from the PriceChanged event.</summary>
public sealed class ChangeBookPriceUseCase(
    IBookRepository books, ICurrentUser user, IClock clock, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(ChangeBookPriceCommand command, CancellationToken ct)
    {
        user.Require(Permissions.PriceChange);
        var book = await books.GetAsync(command.Book, ct).OrNotFound("Book");

        book.ChangePrice(command.NewPrice, command.ValidFrom, user.Id, clock.Now);
        await unitOfWork.CommitAsync(ct);
    }
}
