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

        var before = KeyFields(book);
        book.UpdateDetails(command.Title, command.Barcode, command.Category, command.Authors, command.Publisher);
        var after = KeyFields(book);
        audit.Record("book.updated", book.Id.ToString(),
            before.Select(field => new FieldChange(field.Key, field.Value, after[field.Key])).ToList());
        await unitOfWork.CommitAsync(ct);
        await cache.InvalidateAsync(book.Id, ct);
    }

    private static Dictionary<string, string?> KeyFields(Book book) => new()
    {
        ["title"] = book.Title,
        ["barcode"] = book.Barcode.Value,
        ["category"] = book.CategoryId.ToString(),
        ["publisher"] = book.PublisherId?.ToString(),
        ["authors"] = string.Join(", ", book.Authors.Select(a => a.Value)),
    };

    private async Task EnsureReferencesExistAsync(UpdateBookDetailsCommand command, CancellationToken ct)
    {
        Guard.That(await references.CategoryExistsAsync(command.Category, ct), "category-not-found", "The category does not exist.");
        Guard.That(await references.AllAuthorsExistAsync(command.Authors, ct), "author-not-found", "An author does not exist.");
        if (command.Publisher is { } publisher)
            Guard.That(await references.PublisherExistsAsync(publisher, ct), "publisher-not-found", "The publisher does not exist.");
    }
}
