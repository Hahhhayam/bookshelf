namespace Application.Reporting;

/// <param name="Category">Null for sales of books since deleted from the catalog.</param>
public sealed record CategoryFigure(CategoryId? Category, Quantity Sold, Money Revenue);
