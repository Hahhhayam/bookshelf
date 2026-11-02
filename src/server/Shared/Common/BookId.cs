namespace Shared;

// Typed identifiers. Contexts refer to each other's aggregates only through these.

public readonly record struct BookId(Guid Value)
{
    public static BookId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
