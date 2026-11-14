namespace Domain.Common;

/// <summary>
/// One change of a parent aggregate's value (such as its status) with its time and the responsible user, written
/// from the parent's events. Entries are never changed or deleted; each takes the id of the event it records.
/// </summary>
public abstract class Change<TParentId, TValue> : AggregateRoot<Guid>
    where TParentId : struct
    where TValue : notnull
{
    public TParentId ParentId { get; }
    public TValue From { get; }
    public TValue To { get; }
    public DateTimeOffset At { get; }
    public UserId By { get; }

    protected Change(Guid id, TParentId parentId, TValue from, TValue to, DateTimeOffset at, UserId by) : base(id)
    {
        ParentId = parentId;
        From = from;
        To = to;
        At = at;
        By = by;
    }
}
