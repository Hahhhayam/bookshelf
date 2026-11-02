namespace Domain.Inventory;

public readonly record struct ReservationId(Guid Value)
{
    public static ReservationId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
