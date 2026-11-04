using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    /// <summary>Registers use cases, their helpers and event handlers. The ports they depend on come from adapters.</summary>
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        var assembly = typeof(DependencyInjection).Assembly;
        foreach (var type in assembly.GetTypes().Where(type => IsInjectable(type, assembly)))
        {
            services.AddScoped(type);
            foreach (var handler in type.GetInterfaces().Where(IsEventHandler))
                services.AddScoped(handler, provider => provider.GetRequiredService(type));
        }
        return services;
    }

    private static bool IsInjectable(Type type, Assembly assembly) =>
        type is { IsClass: true, IsAbstract: false, IsPublic: true } &&
        !typeof(Exception).IsAssignableFrom(type) &&
        type.GetConstructors().SingleOrDefault() is { } constructor &&
        constructor.GetParameters().All(p => p.ParameterType.IsInterface || p.ParameterType.Assembly == assembly);

    private static bool IsEventHandler(Type type) =>
        type.IsGenericType && type.GetGenericTypeDefinition() == typeof(IEventHandler<>);
}
