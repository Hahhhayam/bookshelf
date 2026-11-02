namespace Application.Catalog;

public interface ICatalogReferences
{
    Task<bool> AllAuthorsExistAsync(IEnumerable<AuthorId> authors, CancellationToken ct);

    Task<bool> PublisherExistsAsync(PublisherId publisher, CancellationToken ct);

    Task<bool> CategoryExistsAsync(CategoryId category, CancellationToken ct);
}
