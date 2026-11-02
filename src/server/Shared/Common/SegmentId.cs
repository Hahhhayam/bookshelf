namespace Shared;

public readonly record struct SegmentId(Guid Value)
{
    public static SegmentId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
