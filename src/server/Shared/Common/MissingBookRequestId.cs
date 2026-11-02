namespace Shared;

public readonly record struct MissingBookRequestId(Guid Value)
{
    public static MissingBookRequestId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
