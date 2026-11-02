namespace Shared;

public readonly record struct PublisherId(Guid Value)
{
    public static PublisherId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
