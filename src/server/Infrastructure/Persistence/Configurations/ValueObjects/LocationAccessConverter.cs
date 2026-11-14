using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

internal sealed class LocationAccessConverter() : ValueConverter<LocationAccess, string>(
    access => JsonSerializer.Serialize(access.Locations.Select(l => l.Value), (JsonSerializerOptions?)null),
    json => new LocationAccess(
        JsonSerializer.Deserialize<List<Guid>>(json, (JsonSerializerOptions?)null)!
            .Select(g => new LocationId(g)).ToHashSet()));
