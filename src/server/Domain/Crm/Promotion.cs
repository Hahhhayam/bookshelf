namespace Domain.Crm;

public readonly record struct PromotionId(Guid Value)
{
    public static PromotionId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>A discount rule created by marketing and applied automatically during a sale.</summary>
public sealed class Promotion : AggregateRoot<PromotionId>
{
    public string Name { get; private set; }
    public Period Period { get; private set; }
    public PromotionCondition Condition { get; private set; }
    public decimal DiscountPercent { get; private set; }

    /// <summary>When several promotions overlap, the one with the higher priority wins.</summary>
    public int Priority { get; private set; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private Promotion() : base(default) { Name = null!; Condition = null!; }

    private Promotion(PromotionId id, string name, Period period, PromotionCondition condition,
        decimal discountPercent, int priority) : base(id)
    {
        Name = name;
        Period = period;
        Condition = condition;
        DiscountPercent = discountPercent;
        Priority = priority;
    }

    public static Promotion Create(string name, Period period, PromotionCondition condition,
        decimal discountPercent, int priority)
    {
        Guard.That(discountPercent is > 0 and <= 100, "discount-out-of-range", "Discount must be between 0 and 100 percent.");
        return new(PromotionId.New(), Guard.NotBlank(name), period, condition, discountPercent, priority);
    }

    /// <param name="buyer">The customer whose card is on the sale, if any; personal offers need one.</param>
    public bool AppliesTo(BookId book, CategoryId category, Quantity quantity, Customer? buyer, DateTimeOffset at) =>
        Period.Contains(at) && Condition.IsMetBy(book, category, quantity, buyer);

    public Money DiscountFor(Money lineAmount) => lineAmount * (DiscountPercent / 100m);

    /// <summary>Picks the applicable promotion with the highest priority, or null.</summary>
    public static Promotion? SelectWinner(IEnumerable<Promotion> promotions, BookId book, CategoryId category,
        Quantity quantity, Customer? buyer, DateTimeOffset at) =>
        promotions.Where(p => p.AppliesTo(book, category, quantity, buyer, at)).MaxBy(p => p.Priority);
}
