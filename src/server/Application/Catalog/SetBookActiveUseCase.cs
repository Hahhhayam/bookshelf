namespace Application.Catalog;

/// <summary>Puts a deactivated book back on sale (scenario 3.4 undone), or takes one off sale without deleting it.</summary>
public sealed class SetBookActiveUseCase(
    IBookRepository books, ICatalogCache cache, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(BookId id, bool active, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var book = await books.GetAsync(id, ct).OrNotFound("Book");
        var status = book.Status;
        if (active)
            book.Activate();
        else
            book.Deactivate();
        audit.Record(active ? "book.activated" : "book.deactivated", id.ToString(), FieldChange.Set("title", book.Title),
            new FieldChange("status", status.ToString(), book.Status.ToString()));
        await unitOfWork.CommitAsync(ct);
        await cache.InvalidateAsync(id, ct);
    }
}
