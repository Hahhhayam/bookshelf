using System.Net.Http.Headers;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;

namespace EndToEndTests.Hosting;

/// <summary>The real API in memory, on its own database, with time and notifications under the test's control.</summary>
public sealed class BookstoreApp(string connectionString) : WebApplicationFactory<Program>
{
    public TestClock Clock { get; } = new();
    public RecordingNotifications Notifications { get; } = new();

    public Api Anonymous() => new(CreateClient());

    public async Task<Api> LoginAsync(string login, string password)
    {
        var response = await CreateClient().PostAsJsonAsync("auth/login", new { login, password });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var token = JsonNode.Parse(await response.Content.ReadAsStringAsync())!["token"]!.GetValue<string>();

        var client = CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return new Api(client);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        // Added last, so these win over appsettings.json.
        builder.ConfigureAppConfiguration((_, config) => config.AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ConnectionStrings:Bookstore"] = connectionString,
            ["ConnectionStrings:Redis"] = "",
            ["Database:MigrateOnStartup"] = "true",
        }));
        builder.ConfigureTestServices(ReplaceSideEffects);
    }

    // Scheduled jobs would fire at random moments, and real time and e-mail would make the checks flaky.
    private void ReplaceSideEffects(IServiceCollection services)
    {
        foreach (var scheduler in services.Where(IsScheduler).ToList())
            services.Remove(scheduler);
        services.RemoveAll<IClock>();
        services.AddSingleton<IClock>(Clock);
        services.RemoveAll<INotificationSender>();
        services.AddSingleton<INotificationSender>(Notifications);
    }

    /// <summary>Only the job scheduler goes; the host's own hosted services run the web server.</summary>
    private static bool IsScheduler(ServiceDescriptor descriptor) =>
        descriptor.ServiceType == typeof(IHostedService) &&
        (descriptor.ImplementationType ?? descriptor.ImplementationFactory?.Method.DeclaringType)?
            .Assembly.GetName().Name?.StartsWith("Quartz", StringComparison.Ordinal) == true;
}
