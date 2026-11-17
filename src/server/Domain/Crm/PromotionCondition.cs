namespace Domain.Crm;

/// <summary>
/// When a promotion applies: to a specific book or category, from a minimum quantity. A personal offer also names a
/// customer segment or one customer, and then applies only to a sale made with that customer's card.
/// </summary>
public sealed record PromotionCondition(
    BookId? BookId, CategoryId? CategoryId, Quantity MinimumQuantity,
    SegmentId? SegmentId = null, CustomerId? CustomerId = null)
{
    public bool IsMetBy(BookId book, CategoryId category, Quantity quantity, Customer? buyer) =>
        (BookId is null || BookId == book) &&
        (CategoryId is null || CategoryId == category) &&
        quantity >= MinimumQuantity &&
        (SegmentId is not { } segment || buyer?.Segments.Contains(segment) == true) &&
        (CustomerId is null || buyer?.Id == CustomerId);
}
