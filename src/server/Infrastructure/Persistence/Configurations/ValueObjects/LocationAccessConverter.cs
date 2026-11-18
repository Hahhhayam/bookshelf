using System.Text.Json;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

/// <summary>A JSON list of location ids, or the JSON string <c>"all"</c> for access to every location.</summary>
internal sealed class LocationAccessConverter() : ValueConverter<LocationAccess, string>(
    access => ToJson(access), json => FromJson(json))
{
    private const string Everywhere = "all";

    private static string ToJson(LocationAccess access) => access.Everywhere
        ? JsonSerializer.Serialize(Everywhere)
        : JsonSerializer.Serialize(access.Locations.Select(l => l.Value), (JsonSerializerOptions?)null);

    private static LocationAccess FromJson(string json) => json == JsonSerializer.Serialize(Everywhere)
        ? LocationAccess.All
        : new LocationAccess(JsonSerializer.Deserialize<List<Guid>>(json, (JsonSerializerOptions?)null)!
            .Select(g => new LocationId(g)).ToHashSet());
}
