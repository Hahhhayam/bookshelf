using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace Infrastructure.Persistence.Conventions;

public sealed class SingleValueConverter<TModel, TProvider>()
    : ValueConverter<TModel, TProvider>(ToProvider(), FromProvider())
{
    private static Expression<Func<TModel, TProvider>> ToProvider()
    {
        SingleValueObject.TryDescribe(typeof(TModel), out var property, out _);
        var model = Expression.Parameter(typeof(TModel), "model");
        return Expression.Lambda<Func<TModel, TProvider>>(Expression.Property(model, property), model);
    }

    private static Expression<Func<TProvider, TModel>> FromProvider()
    {
        SingleValueObject.TryDescribe(typeof(TModel), out _, out var constructor);
        var value = Expression.Parameter(typeof(TProvider), "value");
        return Expression.Lambda<Func<TProvider, TModel>>(Expression.New(constructor, value), value);
    }
}
