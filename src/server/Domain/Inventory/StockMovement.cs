namespace Domain.Inventory;

/// <summary>One change to the stock with the document that caused it. Together they are the stock history.</summary>
public sealed class StockMovement : Entity<Guid>
{
    public MovementType Type { get; }
    public int Delta { get; }
    public DocumentReference Document { get; }
    public DateTimeOffset OccurredAt { get; }
    public AdjustmentReason? Reason { get; }
    public UserId? By { get; }

    // EF Core cannot bind complex-type properties through the constructor, so it materializes via this one.
    private StockMovement() : base(default) { }

    internal StockMovement(MovementType type, int delta, DocumentReference document, DateTimeOffset occurredAt,
        AdjustmentReason? reason = null, UserId? by = null) : base(Guid.CreateVersion7())
    {
        Type = type;
        Delta = delta;
        Document = document;
        OccurredAt = occurredAt;
        Reason = reason;
        By = by;
    }
}
