namespace Shared;

public readonly record struct ReturnId(Guid Value)
{
    public static ReturnId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
