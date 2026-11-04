using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal sealed class ValueSetComparer<TItem>() : ValueComparer<HashSet<TItem>>(
    (left, right) => left!.SetEquals(right!),
    set => set.Aggregate(0, (hash, item) => hash ^ item!.GetHashCode()),
    set => new HashSet<TItem>(set));
