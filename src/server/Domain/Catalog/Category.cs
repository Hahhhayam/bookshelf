namespace Domain.Catalog;

public sealed class Category : AggregateRoot<CategoryId>
{
    public string Name { get; private set; }

    private Category(CategoryId id, string name) : base(id) => Name = name;

    public static Category Create(string name) => new(CategoryId.New(), Guard.NotBlank(name));

    public void Rename(string name) => Name = Guard.NotBlank(name);
}
