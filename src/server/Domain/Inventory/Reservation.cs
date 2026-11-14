namespace Domain.Inventory;

public readonly record struct ReservationId(Guid Value)
{
    public static ReservationId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>A quantity held for a customer order or a transfer for a defined time.</summary>
public sealed class Reservation : Entity<ReservationId>
{
    public Quantity Quantity { get; }
    public ReservationPurpose Purpose { get; }
    public Guid DocumentId { get; }
    public DateTimeOffset? ExpiresAt { get; }
    public ReservationStatus Status { get; internal set; } = ReservationStatus.Active;

    internal Reservation(Quantity quantity, ReservationPurpose purpose, Guid documentId, DateTimeOffset? expiresAt)
        : base(ReservationId.New())
    {
        Quantity = quantity;
        Purpose = purpose;
        DocumentId = documentId;
        ExpiresAt = expiresAt;
    }

    public bool IsActive => Status == ReservationStatus.Active;
}
