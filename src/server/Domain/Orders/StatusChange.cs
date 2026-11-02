namespace Domain.Orders;

/// <summary>One status transition with its time and the responsible user; together they are the order's history.</summary>
public sealed class StatusChange : Entity<Guid>
{
    public OrderStatus From { get; }
    public OrderStatus To { get; }
    public DateTimeOffset At { get; }
    public UserId? By { get; }

    internal StatusChange(OrderStatus from, OrderStatus to, DateTimeOffset at, UserId? by) : base(Guid.CreateVersion7())
    {
        From = from;
        To = to;
        At = at;
        By = by;
    }
}
