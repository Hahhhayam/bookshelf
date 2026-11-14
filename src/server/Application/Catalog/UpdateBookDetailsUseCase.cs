namespace Application.Catalog;

public sealed record UpdateBookDetailsCommand(
    BookId Book, string Title, Barcode Barcode, CategoryId Category, IReadOnlyList<AuthorId> Authors,
    PublisherId? Publisher);

/// <summary>FR-02 "edit". Price has its own use case because it raises PriceChanged and keeps a history.</summary>
public sealed class UpdateBookDetailsUseCase(
    IBookRepository books, ICatalogReferences references, ICatalogCache cache, ICurrentUser user, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    public async Task ExecuteAsync(UpdateBookDetailsCommand command, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        var book = await books.GetAsync(command.Book, ct).OrNotFound("Book");
        await EnsureReferencesExistAsync(command, ct);

        var before = book.Title;
        book.UpdateDetails(command.Title, command.Barcode, command.Category, command.Authors, command.Publisher);
        audit.Record("book.updated", book.Id.ToString(), before, book.Title);
        await unitOfWork.CommitAsync(ct);
        await cache.InvalidateAsync(book.Id, ct);
    }

    private async Task EnsureReferencesExistAsync(UpdateBookDetailsCommand command, CancellationToken ct)
    {
        Guard.That(await references.CategoryExistsAsync(command.Category, ct), "The category does not exist.");
        Guard.That(await references.AllAuthorsExistAsync(command.Authors, ct), "An author does not exist.");
        if (command.Publisher is { } publisher)
            Guard.That(await references.PublisherExistsAsync(publisher, ct), "The publisher does not exist.");
    }
}
