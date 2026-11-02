namespace Shared;

public readonly record struct WriteOffId(Guid Value)
{
    public static WriteOffId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
