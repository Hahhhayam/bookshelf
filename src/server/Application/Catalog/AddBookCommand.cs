namespace Application.Catalog;

public sealed record AddBookCommand(
    string Title, ItemType ItemType, Barcode Barcode, CategoryId Category, IReadOnlyList<AuthorId> Authors,
    PublisherId? Publisher, Isbn? Isbn, Money Price);
