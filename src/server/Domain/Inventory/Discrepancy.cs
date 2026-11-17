namespace Domain.Inventory;

/// <summary>Raised when the received quantity differs from the shipped one, so someone can review it.</summary>
public sealed class Discrepancy : Entity<Guid>
{
    public BookId BookId { get; }
    public Quantity Expected { get; }
    public Quantity Actual { get; }
    public bool IsResolved { get; private set; }

    /// <summary>Why the quantities differ, as found by the reviewer.</summary>
    public string? Reason { get; private set; }

    public UserId? ResolvedBy { get; private set; }
    public DateTimeOffset? ResolvedAt { get; private set; }

    internal Discrepancy(BookId bookId, Quantity expected, Quantity actual) : base(Guid.CreateVersion7())
    {
        BookId = bookId;
        Expected = expected;
        Actual = actual;
    }

    internal void Resolve(string reason, UserId by, DateTimeOffset now)
    {
        Guard.That(!IsResolved, "discrepancy-resolved", "The discrepancy is already resolved.");
        Reason = Guard.NotBlank(reason);
        ResolvedBy = by;
        ResolvedAt = now;
        IsResolved = true;
    }
}
