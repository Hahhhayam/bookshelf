using Application.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure.Persistence;

/// <summary>
/// Runs the handlers of the tracked aggregates' domain events just before they are saved, so whatever the
/// handlers change is written in the same transaction. Handlers must not commit themselves.
/// </summary>
public sealed class DomainEventInterceptor(IServiceProvider services) : SaveChangesInterceptor
{
    public override async ValueTask<InterceptionResult<int>> SavingChangesAsync(
        DbContextEventData eventData, InterceptionResult<int> result, CancellationToken ct = default)
    {
        if (eventData.Context is { } db)
            await DispatchAsync(db, ct);
        return result;
    }

    // A handler may change other aggregates that raise events of their own, so keep going until none are left.
    private async Task DispatchAsync(DbContext db, CancellationToken ct)
    {
        while (TakeEvents(db) is { Count: > 0 } events)
            foreach (var domainEvent in events)
                await PublishAsync(domainEvent, ct);
    }

    private static List<IDomainEvent> TakeEvents(DbContext db)
    {
        var roots = db.ChangeTracker.Entries<IAggregateRoot>().Select(e => e.Entity).ToList();
        var events = roots.SelectMany(r => r.DomainEvents).ToList();
        roots.ForEach(r => r.ClearDomainEvents());
        return events;
    }

    private async Task PublishAsync(IDomainEvent domainEvent, CancellationToken ct)
    {
        var handlerType = typeof(IEventHandler<>).MakeGenericType(domainEvent.GetType());
        foreach (dynamic handler in services.GetServices(handlerType))
            await handler.HandleAsync((dynamic)domainEvent, ct);
    }
}
