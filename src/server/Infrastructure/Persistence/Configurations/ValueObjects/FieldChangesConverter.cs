using System.Text.Json.Nodes;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

/// <summary>Stores an audit record's field changes as a JSON array of {field, before, after}.</summary>
internal sealed class FieldChangesConverter() : ValueConverter<IReadOnlyList<FieldChange>, string>(
    changes => Serialize(changes), json => Deserialize(json))
{
    private static string Serialize(IReadOnlyList<FieldChange> changes) =>
        new JsonArray(changes.Select(ToJson).ToArray()).ToJsonString();

    private static JsonNode ToJson(FieldChange change) =>
        new JsonObject { ["field"] = change.Field, ["before"] = change.Before, ["after"] = change.After };

    private static IReadOnlyList<FieldChange> Deserialize(string json) =>
        JsonNode.Parse(json)!.AsArray()
            .Select(c => new FieldChange((string)c!["field"]!, (string?)c["before"], (string?)c["after"]))
            .ToList();
}
