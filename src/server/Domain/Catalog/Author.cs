namespace Domain.Catalog;

public readonly record struct AuthorId(Guid Value)
{
    public static AuthorId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

public sealed class Author : AggregateRoot<AuthorId>
{
    public string Name { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Author(AuthorId id, string name) : base(id) => Name = name;

    public static Author Create(string name) => new(AuthorId.New(), Guard.NotBlank(name));

    public void Rename(string name) => Name = Guard.NotBlank(name);

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
