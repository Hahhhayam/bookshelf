namespace Shared;

public readonly record struct AuthorId(Guid Value)
{
    public static AuthorId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
