namespace Application.Purchasing;

public sealed record PurchaseOrderLineRequest(BookId Book, Quantity Quantity, Money PurchasePrice);
