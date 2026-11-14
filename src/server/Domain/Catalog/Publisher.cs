namespace Domain.Catalog;

public readonly record struct PublisherId(Guid Value)
{
    public static PublisherId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

public sealed class Publisher : AggregateRoot<PublisherId>
{
    public string Name { get; private set; }
    public bool IsActive { get; private set; } = true;

    private Publisher(PublisherId id, string name) : base(id) => Name = name;

    public static Publisher Create(string name) => new(PublisherId.New(), Guard.NotBlank(name));

    public void Rename(string name) => Name = Guard.NotBlank(name);

    public void Deactivate() => IsActive = false;

    public void Activate() => IsActive = true;
}
