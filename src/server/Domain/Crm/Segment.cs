namespace Domain.Crm;

public sealed class Segment : AggregateRoot<SegmentId>
{
    public string Name { get; private set; }
    public string? Description { get; private set; }

    private Segment(SegmentId id, string name, string? description) : base(id)
    {
        Name = name;
        Description = description;
    }

    public static Segment Create(string name, string? description = null) =>
        new(SegmentId.New(), Guard.NotBlank(name), description);

    public void Update(string name, string? description)
    {
        Name = Guard.NotBlank(name);
        Description = description;
    }
}
