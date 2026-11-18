namespace Infrastructure.Persistence.Queries.Catalog;

/// <summary>Typo-tolerant closeness of a search text to a book's title or author names (edit distance per word).</summary>
internal static class NearestMatch
{
    public const int MaxSuggestions = 5;

    public static IReadOnlyList<T> Closest<T>(
        string text, IEnumerable<T> candidates, Func<T, IEnumerable<string>> namesOf)
    {
        var wanted = text.Trim();
        var allowed = Math.Max(2, wanted.Length / 3);
        return candidates
            .Select(candidate => (candidate, distance: Distance(wanted, namesOf(candidate))))
            .Where(x => x.distance <= allowed)
            .OrderBy(x => x.distance)
            .Take(MaxSuggestions)
            .Select(x => x.candidate)
            .ToList();
    }

    private static int Distance(string wanted, IEnumerable<string> names) =>
        names.SelectMany(name => Fragments(name)).Select(fragment => Levenshtein(wanted, fragment)).DefaultIfEmpty(int.MaxValue).Min();

    private static IEnumerable<string> Fragments(string name) =>
        name.Split(' ', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries).Append(name);

    private static int Levenshtein(string a, string b)
    {
        var previous = Enumerable.Range(0, b.Length + 1).ToArray();
        for (var i = 1; i <= a.Length; i++)
        {
            var current = new int[b.Length + 1];
            current[0] = i;
            for (var j = 1; j <= b.Length; j++)
            {
                var cost = char.ToLowerInvariant(a[i - 1]) == char.ToLowerInvariant(b[j - 1]) ? 0 : 1;
                current[j] = Math.Min(Math.Min(current[j - 1] + 1, previous[j] + 1), previous[j - 1] + cost);
            }
            previous = current;
        }
        return previous[b.Length];
    }
}
