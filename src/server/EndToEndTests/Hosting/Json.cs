namespace EndToEndTests.Hosting;

/// <summary>Short reads of the API's JSON responses.</summary>
public static class Json
{
    public static Guid Id(this JsonNode node) => node["id"]!.GetValue<Guid>();

    public static string Text(this JsonNode node, string property) => node[property]!.GetValue<string>();

    public static int Number(this JsonNode node, string property) => node[property]!.GetValue<int>();

    public static decimal Amount(this JsonNode node, string moneyProperty) =>
        node[moneyProperty]!["amount"]!.GetValue<decimal>();

    public static IReadOnlyList<JsonNode> Items(this JsonNode node, string? property = null) =>
        (property is null ? node : node[property]!).AsArray().Select(item => item!).ToList();

    public static JsonNode With(this IEnumerable<JsonNode> items, string property, Guid value) =>
        items.Single(item => item[property]!.GetValue<Guid>() == value);
}
