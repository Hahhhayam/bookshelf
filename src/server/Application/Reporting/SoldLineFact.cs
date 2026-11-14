namespace Application.Reporting;

/// <summary>One line of a completed sale; revenue is after the line's discount.</summary>
/// <param name="Category">Null when the book has since been deleted from the catalog.</param>
public sealed record SoldLineFact(
    SaleId Sale, LocationId Location, BookId Book, CategoryId? Category, Quantity Quantity, Money Revenue);
