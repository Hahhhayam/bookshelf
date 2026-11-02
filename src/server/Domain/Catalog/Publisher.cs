namespace Domain.Catalog;

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
