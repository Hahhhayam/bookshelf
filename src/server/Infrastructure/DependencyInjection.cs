using Application.Common;
using Application.Crm;
using Infrastructure.Bonuses;
using Infrastructure.Exchange;
using Infrastructure.Notifications;
using Infrastructure.Returns;
using Infrastructure.Payments;
using Infrastructure.Persistence;
using Application.Administration;
using Application.Sales;
using Infrastructure.Persistence.Queries.Reporting;
using Infrastructure.Security;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace Infrastructure;

public static class DependencyInjection
{
    private static readonly string[] AdapterNamespaces =
    [
        $"{typeof(BookstoreDbContext).Namespace}.{nameof(Persistence.Repositories)}",
        $"{typeof(BookstoreDbContext).Namespace}.{nameof(Persistence.Queries)}",
    ];

    /// <param name="configureDatabase">Picks the database provider, e.g. <c>o =&gt; o.UseNpgsql(connectionString)</c>.</param>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, Action<DbContextOptionsBuilder> configureDatabase, ReportingOptions? reporting = null)
    {
        services.AddDbContext<BookstoreDbContext>(configureDatabase);
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.TryAddSingleton<IClock, SystemClock>();
        services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
        services.AddScoped<ISessionIssuer, SessionIssuer>();
        services.AddScoped<IPaymentGateway, StubPaymentGateway>();
        services.AddSingleton<ICurrencyConverter, StubCurrencyConverter>();
        services.AddScoped<INotificationSender, SmtpNotificationSender>();
        services.AddOptions<SmtpOptions>();
        services.AddOptions<BonusOptions>();
        services.AddScoped<IBonusPolicy, ConfiguredBonusPolicy>();
        services.AddSingleton<IReturnPolicy, SevenDayReturnPolicy>();
        services.AddSingleton(reporting ?? new ReportingOptions());
        AddPortAdapters(services);
        return services;
    }

    private static void AddPortAdapters(IServiceCollection services)
    {
        var applicationAssembly = typeof(IUnitOfWork).Assembly;
        var adapters = typeof(DependencyInjection).Assembly.GetTypes()
            .Where(t => t is { IsClass: true, IsAbstract: false } && AdapterNamespaces.Any(n => t.Namespace?.StartsWith(n) == true));

        foreach (var adapter in adapters)
        foreach (var port in adapter.GetInterfaces().Where(i => i.Assembly == applicationAssembly))
            services.AddScoped(port, adapter);
    }
}
