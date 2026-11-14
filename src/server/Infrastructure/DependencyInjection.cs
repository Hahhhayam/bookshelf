using Application.Catalog;
using Application.Common;
using Application.Crm;
using Application.Orders;
using Infrastructure.Bonuses;
using Infrastructure.Caching;
using Infrastructure.Exchange;
using Infrastructure.Notifications;
using Infrastructure.Orders;
using Infrastructure.Returns;
using Infrastructure.Payments;
using Infrastructure.Persistence;
using Application.Administration;
using Application.Sales;
using Infrastructure.Persistence.Queries.Reporting;
using Infrastructure.Scheduling;
using Infrastructure.Security;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Quartz;

namespace Infrastructure;

public static class DependencyInjection
{
    /// <param name="configureDatabase">Picks the database provider, e.g. <c>o =&gt; o.UseNpgsql(connectionString)</c>.</param>
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services, Action<DbContextOptionsBuilder> configureDatabase,
        ReportingOptions? reporting = null, ScheduledJobsOptions? scheduling = null)
    {
        services.AddScoped<DomainEventInterceptor>();
        services.AddDbContext<BookstoreDbContext>((provider, options) =>
        {
            configureDatabase(options);
            options.AddInterceptors(provider.GetRequiredService<DomainEventInterceptor>());
        });
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.TryAddSingleton<IClock, SystemClock>();
        services.AddSingleton<IPasswordHasher, Pbkdf2PasswordHasher>();
        services.AddScoped<ISessionIssuer, SessionIssuer>();
        services.AddScoped<ISessionValidator, SessionValidator>();
        services.AddScoped<ISessionRevoker, SessionRevoker>();
        services.AddScoped<IPaymentGateway, StubPaymentGateway>();
        services.AddSingleton<ICurrencyConverter, StubCurrencyConverter>();
        services.AddScoped<INotificationSender, SmtpNotificationSender>();
        services.AddOptions<SmtpOptions>();
        services.AddOptions<BonusOptions>();
        services.AddScoped<IBonusPolicy, ConfiguredBonusPolicy>();
        services.AddSingleton<IReturnPolicy, SevenDayReturnPolicy>();
        services.AddSingleton<IPickupCodeGenerator, GuidPickupCodeGenerator>();
        services.AddSingleton<ICatalogCache, DistributedCatalogCache>();
        services.AddSingleton<ISearchResultCache, DistributedSearchResultCache>();
        services.AddSingleton(reporting ?? new ReportingOptions());
        AddPortAdapters(services);
        AddScheduledJobs(services, scheduling ?? new ScheduledJobsOptions());
        return services;
    }

    // Quartz keeps its schedule in memory, so every app instance runs these jobs; both are safe to repeat.
    private static void AddScheduledJobs(IServiceCollection services, ScheduledJobsOptions scheduling)
    {
        services.AddQuartz(quartz =>
        {
            quartz.ScheduleJob<ExpireReservationsJob>(trigger => trigger.StartNow()
                .WithSimpleSchedule(s => s.WithInterval(scheduling.ExpireReservationsInterval).RepeatForever()));
            quartz.ScheduleJob<FlagOverduePurchaseOrdersJob>(trigger => trigger.StartNow()
                .WithSimpleSchedule(s => s.WithInterval(scheduling.FlagOverduePurchaseOrdersInterval).RepeatForever()));
        });
        services.AddQuartzHostedService(options => options.WaitForJobsToComplete = true);
    }

    private static readonly string[] AdapterNamespaces =
    [
        $"{typeof(BookstoreDbContext).Namespace}.{nameof(Persistence.Repositories)}",
        $"{typeof(BookstoreDbContext).Namespace}.{nameof(Persistence.Queries)}",
    ];
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
