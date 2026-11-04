using System.Reflection;

namespace Infrastructure.Persistence.Conventions;

/// <summary>
/// Recognises the domain's one-value structs (typed ids, Quantity, Isbn...): a single public constructor whose only
/// parameter is exposed by a property of the same name. They are stored as that one value.
/// </summary>
internal static class SingleValueObject
{
    public static bool TryDescribe(Type type, out PropertyInfo property, out ConstructorInfo constructor)
    {
        property = null!;
        constructor = null!;
        if (!type.IsValueType || !type.IsPublic || type.IsEnum || type.IsPrimitive)
            return false;

        var constructors = type.GetConstructors();
        if (constructors.Length != 1 || constructors[0].GetParameters() is not [var parameter])
            return false;

        var found = type.GetProperty(parameter.Name!, BindingFlags.Public | BindingFlags.Instance | BindingFlags.IgnoreCase);
        if (found is null || !found.CanRead || found.PropertyType != parameter.ParameterType)
            return false;

        property = found;
        constructor = constructors[0];
        return true;
    }

    public static IEnumerable<(Type Model, Type Provider)> Find(params Assembly[] assemblies) =>
        assemblies
            .SelectMany(a => a.GetExportedTypes())
            .Where(t => TryDescribe(t, out _, out _))
            .Select(t =>
            {
                TryDescribe(t, out var property, out _);
                return (t, property.PropertyType);
            });
}
