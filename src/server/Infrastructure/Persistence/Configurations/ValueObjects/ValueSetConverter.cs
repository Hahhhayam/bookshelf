using System.Text.Json;
using Infrastructure.Persistence.Conventions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Configurations.ValueObjects;

/// <summary>Stores a set of one-value structs (role ids, permissions...) as a JSON array of the inner values.</summary>
internal sealed class ValueSetConverter<TItem, TValue>() : ValueConverter<HashSet<TItem>, string>(
    set => Serialize(set), json => Deserialize(json))
{
    private static readonly SingleValueConverter<TItem, TValue> Item = new();
    private static readonly Func<TItem, TValue> Unwrap = Item.ConvertToProviderExpression.Compile();
    private static readonly Func<TValue, TItem> Wrap = Item.ConvertFromProviderExpression.Compile();

    private static string Serialize(HashSet<TItem> set) =>
        JsonSerializer.Serialize(set.Select(Unwrap).ToList(), (JsonSerializerOptions?)null);

    private static HashSet<TItem> Deserialize(string json) =>
        JsonSerializer.Deserialize<List<TValue>>(json, (JsonSerializerOptions?)null)!.Select(Wrap).ToHashSet();
}
