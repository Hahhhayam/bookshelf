namespace Application.Catalog;

/// <param name="AvailableAt">When set, only books with available stock at this location are returned.</param>
public sealed record BookSearchQuery(
    string? Text, Isbn? Isbn, AuthorId? Author, PublisherId? Publisher, CategoryId? Category, LocationId? AvailableAt);
