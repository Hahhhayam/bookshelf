namespace Application.Catalog;

public sealed record AddBookCommand(
    string Title, ItemType ItemType, Barcode Barcode, CategoryId Category, IReadOnlyList<AuthorId> Authors,
    PublisherId? Publisher, Isbn? Isbn, Money Price);

/// <summary>Scenario 3.2.</summary>
public sealed class AddBookUseCase(
    IBookRepository books, ICatalogReferences references, ICurrentUser user, IClock clock, AuditTrail audit,
    IUnitOfWork unitOfWork)
{
    public async Task<BookId> ExecuteAsync(AddBookCommand command, CancellationToken ct)
    {
        user.Require(Permissions.CatalogEdit);
        await EnsureReferencesExistAsync(command, ct);

        var isbnTaken = command.Isbn is { } isbn && await books.IsIsbnTakenAsync(isbn, ct);
        var book = Book.Create(command.Title, command.ItemType, command.Barcode, command.Category,
            command.Authors, command.Publisher, command.Isbn, command.Price, clock.Now, user.Id,
            new KnownIsbnRegistry(isbnTaken));

        books.Add(book);
        audit.Record("book.created", book.Id.ToString(), FieldChange.Set("title", book.Title));
        await unitOfWork.CommitAsync(ct);
        return book.Id;
    }

    private async Task EnsureReferencesExistAsync(AddBookCommand command, CancellationToken ct)
    {
        Guard.That(await references.CategoryExistsAsync(command.Category, ct), "category-not-found", "The category does not exist.");
        Guard.That(await references.AllAuthorsExistAsync(command.Authors, ct), "author-not-found", "An author does not exist.");
        if (command.Publisher is { } publisher)
            Guard.That(await references.PublisherExistsAsync(publisher, ct), "publisher-not-found", "The publisher does not exist.");
    }
}
