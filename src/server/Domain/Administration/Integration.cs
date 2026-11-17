namespace Domain.Administration;

public readonly record struct IntegrationId(Guid Value)
{
    public static IntegrationId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}

/// <summary>Settings and health of one external connection, reached through an adapter.</summary>
public sealed class Integration : AggregateRoot<IntegrationId>
{
    public IntegrationKind Kind { get; }
    public string Name { get; private set; }
    public bool IsEnabled { get; private set; } = true;
    public IntegrationStatus Status { get; private set; } = IntegrationStatus.Healthy;
    public string? LastError { get; private set; }
    public DateTimeOffset? LastErrorAt { get; private set; }
    public DateTimeOffset? LastExchangeAt { get; private set; }

    private Integration(IntegrationId id, IntegrationKind kind, string name) : base(id)
    {
        Kind = kind;
        Name = name;
    }

    public static Integration Create(IntegrationKind kind, string name) =>
        new(IntegrationId.New(), kind, Guard.NotBlank(name));

    public void Enable() => IsEnabled = true;

    public void Disable() => IsEnabled = false;

    /// <summary>Raises IntegrationFailed only when the connection turns from healthy to failed.</summary>
    public void ReportFailure(string error, DateTimeOffset now)
    {
        LastError = Guard.NotBlank(error);
        LastErrorAt = now;
        if (Status == IntegrationStatus.Failed)
            return;
        Status = IntegrationStatus.Failed;
        Raise(new IntegrationFailed(Id, Kind, error, now));
    }

    /// <summary>A successful exchange means the connection works again; the last error stays visible with its time.</summary>
    public void ReportExchange(DateTimeOffset now)
    {
        LastExchangeAt = now;
        Status = IntegrationStatus.Healthy;
    }
}
