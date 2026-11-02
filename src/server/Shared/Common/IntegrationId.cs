namespace Shared;

public readonly record struct IntegrationId(Guid Value)
{
    public static IntegrationId New() => new(Guid.CreateVersion7());
    public override string ToString() => Value.ToString();
}
