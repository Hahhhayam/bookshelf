namespace Domain.Crm;

/// <summary>One accrual or redemption, linked to the sale or return that caused it.</summary>
public sealed class BonusTransaction : Entity<Guid>
{
    public BonusTransactionKind Kind { get; }
    public int Points { get; }
    public Guid SourceDocumentId { get; }
    public DateTimeOffset At { get; }

    internal BonusTransaction(BonusTransactionKind kind, int points, Guid sourceDocumentId, DateTimeOffset at)
        : base(Guid.CreateVersion7())
    {
        Kind = kind;
        Points = points;
        SourceDocumentId = sourceDocumentId;
        At = at;
    }
}
