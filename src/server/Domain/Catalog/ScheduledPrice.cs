namespace Domain.Catalog;

/// <summary>
/// A base price decided now that takes effect from a later moment (scenario 3.3). A book has at most one; deciding
/// again replaces it. It reaches the book, and so the price history, only when its moment comes.
/// </summary>
public sealed class ScheduledPrice : AggregateRoot<BookId>
{
    public Money Price { get; private set; }
    public DateTimeOffset EffectiveFrom { get; private set; }
    public UserId SetBy { get; private set; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private ScheduledPrice() : base(default) { }

    private ScheduledPrice(BookId book) : base(book) { }

    public static ScheduledPrice Schedule(
        BookId book, Money price, DateTimeOffset effectiveFrom, UserId setBy, DateTimeOffset now)
    {
        var scheduled = new ScheduledPrice(book);
        scheduled.Replace(price, effectiveFrom, setBy, now);
        return scheduled;
    }

    public void Replace(Money price, DateTimeOffset effectiveFrom, UserId setBy, DateTimeOffset now)
    {
        Guard.That(!price.IsNegative, "price-negative", "Price cannot be negative.");
        Guard.That(effectiveFrom > now, "scheduled-price-not-future", "A scheduled price must take effect in the future.");
        Price = price;
        EffectiveFrom = effectiveFrom;
        SetBy = setBy;
    }

    /// <summary>The change is dated at its effective moment, so the history shows when the price really started.</summary>
    public void ApplyTo(Book book)
    {
        Guard.That(book.Id == Id, "scheduled-price-wrong-book", "A scheduled price applies only to its own book.");
        book.ChangePrice(Price, SetBy, EffectiveFrom);
    }
}
