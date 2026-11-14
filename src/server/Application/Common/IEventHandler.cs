namespace Application.Common;

/// <summary>
/// Runs before the raising aggregate is saved, inside the same save, so it must only change tracked state
/// and never commit. A failing handler aborts the whole save.
/// </summary>
public interface IEventHandler<in TEvent> where TEvent : IDomainEvent
{
    Task HandleAsync(TEvent domainEvent, CancellationToken ct);
}
