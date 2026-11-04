namespace Infrastructure.Persistence.Queries.Reporting;

internal sealed record SoldLine(BookId Book, Quantity Quantity, Money Revenue);
