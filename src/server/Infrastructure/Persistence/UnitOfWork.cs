using System.Text.Json;
using System.Text.Json.Serialization;
using Infrastructure.Persistence.Outbox;

namespace Infrastructure.Persistence;

/// <summary>Saves the tracked aggregates and the outbox messages for their domain events in one transaction.</summary>
public sealed class UnitOfWork(BookstoreDbContext db) : IUnitOfWork
{
    private static readonly JsonSerializerOptions EventJson = new() { Converters = { new JsonStringEnumConverter() } };

    public async Task CommitAsync(CancellationToken ct)
    {
        var roots = db.ChangeTracker.Entries<IAggregateRoot>().Select(e => e.Entity).ToList();
        foreach (var domainEvent in roots.SelectMany(r => r.DomainEvents))
            db.Set<OutboxMessage>().Add(OutboxMessage.From(domainEvent, EventJson));

        await db.SaveChangesAsync(ct);
        roots.ForEach(r => r.ClearDomainEvents());
    }
}
