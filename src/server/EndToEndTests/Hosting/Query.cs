namespace EndToEndTests.Hosting;

/// <summary>Builds query strings; dates go out as UTC so no '+' needs escaping.</summary>
public static class Query
{
    public static string Of(string path, params (string Name, object? Value)[] parameters)
    {
        var pairs = parameters
            .Where(p => p.Value is not null)
            .Select(p => $"{p.Name}={Uri.EscapeDataString(Format(p.Value!))}");
        return $"{path}?{string.Join("&", pairs)}";
    }

    private static string Format(object value) => value switch
    {
        DateTimeOffset at => at.UtcDateTime.ToString("yyyy-MM-ddTHH:mm:ssZ"),
        bool flag => flag ? "true" : "false",
        _ => value.ToString()!,
    };
}
