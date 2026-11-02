namespace Application.Catalog;

/// <summary>Answers whether a book still has active orders, reservations or unfulfilled deliveries.</summary>
public interface IBookCommitments
{
    Task<bool> ExistAsync(BookId book, CancellationToken ct);
}
