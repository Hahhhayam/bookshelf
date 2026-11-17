namespace Application.Catalog;

/// <summary>Scenario 3.4. Deletes the book, or only deactivates it when something still depends on it.</summary>
public sealed class RemoveBookUseCase(
    IBookRepository books, IBookCommitments commitments, ICatalogCache cache, ICurrentUser user, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    public async Task<RemovalMode> ExecuteAsync(BookId bookId, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var book = await books.GetAsync(bookId, ct).OrNotFound("Book");

        var mode = Book.DecideRemoval(await commitments.ExistAsync(bookId, ct));
        var status = book.Status;
        Apply(book, mode);
        audit.Record($"book.{mode.ToString().ToLowerInvariant()}d", bookId.ToString(), FieldChange.Set("title", book.Title),
            new FieldChange("status", status.ToString(), mode == RemovalMode.Delete ? null : book.Status.ToString()));
        await unitOfWork.CommitAsync(ct);
        await cache.InvalidateAsync(bookId, ct);
        return mode;
    }

    private void Apply(Book book, RemovalMode mode)
    {
        if (mode == RemovalMode.Delete)
            books.Remove(book);
        else
            book.Deactivate();
    }
}
