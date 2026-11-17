using System.Net.Http.Json;

namespace EndToEndTests.Hosting;

/// <summary>HTTP calls of one signed-in (or anonymous) client. Every call checks the status it expects.</summary>
public sealed class Api(HttpClient http)
{
    public async Task<JsonNode> Get(string url, IReadOnlyDictionary<string, string>? headers = null) =>
        JsonNode.Parse(await SendAsync(HttpMethod.Get, url, null, headers, HttpStatusCode.OK))!;

    public Task<string> GetText(string url, IReadOnlyDictionary<string, string>? headers = null) =>
        SendAsync(HttpMethod.Get, url, null, headers, HttpStatusCode.OK);

    /// <summary>Posts a new resource and returns the created response body.</summary>
    public async Task<JsonNode> Create(string url, object body, IReadOnlyDictionary<string, string>? headers = null) =>
        JsonNode.Parse(await SendAsync(HttpMethod.Post, url, body, headers, HttpStatusCode.Created))!;

    public Task Post(string url, object? body = null, IReadOnlyDictionary<string, string>? headers = null) =>
        SendAsync(HttpMethod.Post, url, body, headers, HttpStatusCode.NoContent);

    public Task Put(string url, object body, IReadOnlyDictionary<string, string>? headers = null) =>
        SendAsync(HttpMethod.Put, url, body, headers, HttpStatusCode.NoContent);

    public Task Delete(string url, IReadOnlyDictionary<string, string>? headers = null) =>
        SendAsync(HttpMethod.Delete, url, null, headers, HttpStatusCode.NoContent);

    /// <summary>Posts a calculation that changes nothing, such as a receipt quote, and returns its result.</summary>
    public async Task<JsonNode> Compute(string url, object body) =>
        JsonNode.Parse(await SendAsync(HttpMethod.Post, url, body, null, HttpStatusCode.OK))!;

    /// <summary>Sends a call that must be refused with the given status.</summary>
    public Task Refused(HttpStatusCode status, HttpMethod method, string url, object? body = null,
        IReadOnlyDictionary<string, string>? headers = null) =>
        SendAsync(method, url, body, headers, status);

    /// <summary>Sends a call that must break a business rule (422) with the given error code.</summary>
    public async Task Rejected(string code, HttpMethod method, string url, object? body = null,
        IReadOnlyDictionary<string, string>? headers = null)
    {
        var problem = JsonNode.Parse(await SendAsync(method, url, body, headers, HttpStatusCode.UnprocessableEntity))!;
        Assert.Equal(code, problem["code"]?.GetValue<string>());
    }

    private async Task<string> SendAsync(HttpMethod method, string url, object? body,
        IReadOnlyDictionary<string, string>? headers, HttpStatusCode expected)
    {
        using var request = new HttpRequestMessage(method, url) { Content = body is null ? null : JsonContent.Create(body) };
        foreach (var (name, value) in headers ?? new Dictionary<string, string>())
            request.Headers.Add(name, value);
        return await ReadExpectingAsync(await http.SendAsync(request), expected);
    }

    private static async Task<string> ReadExpectingAsync(HttpResponseMessage response, HttpStatusCode expected)
    {
        var body = await response.Content.ReadAsStringAsync();
        Assert.True(response.StatusCode == expected,
            $"{response.RequestMessage?.Method} {response.RequestMessage?.RequestUri} returned {(int)response.StatusCode}, " +
            $"expected {(int)expected}. Body: {body}");
        return body;
    }
}
