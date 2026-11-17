namespace Domain.Sales;

public readonly record struct ShiftId(Guid Value)
{
    public static ShiftId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>A store's till shift. The store sells only while a shift is open (scenario 3.5 «Каса відкрита»).</summary>
public sealed class Shift : AggregateRoot<ShiftId>
{
    public LocationId LocationId { get; }
    public UserId OpenedBy { get; }
    public DateTimeOffset OpenedAt { get; }
    public UserId? ClosedBy { get; private set; }
    public DateTimeOffset? ClosedAt { get; private set; }

    public bool IsOpen => ClosedAt is null;

    private Shift(ShiftId id, LocationId locationId, UserId openedBy, DateTimeOffset openedAt) : base(id)
    {
        LocationId = locationId;
        OpenedBy = openedBy;
        OpenedAt = openedAt;
    }

    /// <summary>A store has at most one open shift; the caller checks that none is open before this point.</summary>
    public static Shift Open(LocationId locationId, UserId by, DateTimeOffset now) =>
        new(ShiftId.New(), locationId, by, now);

    public void Close(UserId by, DateTimeOffset now)
    {
        Guard.That(IsOpen, "shift-closed", "The shift is already closed.");
        ClosedBy = by;
        ClosedAt = now;
    }
}
