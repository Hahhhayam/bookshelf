using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal sealed class FieldChangesComparer() : ValueComparer<IReadOnlyList<FieldChange>>(
    (left, right) => left!.SequenceEqual(right!),
    changes => changes.Aggregate(0, (hash, change) => HashCode.Combine(hash, change)),
    changes => changes.ToList());
