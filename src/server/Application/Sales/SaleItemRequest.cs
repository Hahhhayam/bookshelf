namespace Application.Sales;

public sealed record SaleItemRequest(BookId Book, Quantity Quantity, Money? ManualDiscount);
