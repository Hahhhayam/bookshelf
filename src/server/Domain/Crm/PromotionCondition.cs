namespace Domain.Crm;

/// <summary>When a promotion applies: to a specific book or category, from a minimum quantity.</summary>
public sealed record PromotionCondition(BookId? BookId, CategoryId? CategoryId, Quantity MinimumQuantity)
{
    public bool IsMetBy(BookId book, CategoryId category, Quantity quantity) =>
        (BookId is null || BookId == book) &&
        (CategoryId is null || CategoryId == category) &&
        quantity >= MinimumQuantity;
}
