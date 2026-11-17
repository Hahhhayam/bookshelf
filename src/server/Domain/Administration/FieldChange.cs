namespace Domain.Administration;

/// <summary>A key field of an audited entity with its value before and after the action (FR-17); null when absent.</summary>
public sealed record FieldChange
{
    public string Field { get; }
    public string? Before { get; }
    public string? After { get; }

    public FieldChange(string field, string? before, string? after)
    {
        Field = Guard.NotBlank(field);
        Before = before;
        After = after;
    }

    /// <summary>A value the action set, such as the name of a created item.</summary>
    public static FieldChange Set(string field, string after) => new(field, null, after);
}
