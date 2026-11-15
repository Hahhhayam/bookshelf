namespace Application.Catalog;

/// <summary>
/// Public like the book card. Every book gets its first entry when it is added, so an empty history means the book
/// does not exist.
/// </summary>
public sealed class GetPriceHistoryUseCase(IBookDetailsQuery query)
{
    public async Task<IReadOnlyList<PriceEntry>> ExecuteAsync(BookId book, CancellationToken ct)
    {
        var history = await query.PriceHistoryAsync(book, ct);
        return history.Count > 0 ? history : throw new NotFoundException("Book");
    }
}
