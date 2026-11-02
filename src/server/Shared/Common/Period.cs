namespace Shared;

/// <summary>A time interval; start is inclusive, end is exclusive.</summary>
public readonly record struct Period
{
    public DateTimeOffset Start { get; }
    public DateTimeOffset End { get; }

    public Period(DateTimeOffset start, DateTimeOffset end)
    {
        Guard.That(end > start, "Period end must be after its start.");
        Start = start;
        End = end;
    }

    public bool Contains(DateTimeOffset moment) => moment >= Start && moment < End;

    public bool Overlaps(Period other) => Start < other.End && other.Start < End;
}
