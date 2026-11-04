namespace Application.Catalog;

public sealed record ChangeBookPriceCommand(BookId Book, Money NewPrice, DateTimeOffset ValidFrom);
