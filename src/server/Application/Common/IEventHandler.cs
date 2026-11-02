namespace Application.Common;

/// <summary>Delivery from the outbox is at least once, so handlers must tolerate repeated events.</summary>
public interface IEventHandler<in TEvent> where TEvent : IDomainEvent
{
    Task HandleAsync(TEvent domainEvent, CancellationToken ct);
}
