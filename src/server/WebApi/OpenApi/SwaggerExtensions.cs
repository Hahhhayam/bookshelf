using Microsoft.OpenApi;

namespace WebApi.OpenApi;

/// <summary>OpenAPI document and Swagger UI (NFR Compatibility). The UI sends the session token as a bearer header.</summary>
public static class SwaggerExtensions
{
    private const string BearerScheme = "bearer";

    public static IServiceCollection AddBookstoreSwagger(this IServiceCollection services)
    {
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.SwaggerDoc("v1", new OpenApiInfo { Title = "Bookstore API", Version = "v1" });
            options.AddSecurityDefinition(BearerScheme, new OpenApiSecurityScheme
            {
                Type = SecuritySchemeType.Http,
                Scheme = BearerScheme,
                Description = "The session token returned by POST /auth/login.",
            });
            options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
            {
                [new OpenApiSecuritySchemeReference(BearerScheme, document)] = [],
            });
        });
        return services;
    }

    /// <summary>Only in Development, so the full API surface is not published in production.</summary>
    public static WebApplication UseBookstoreSwagger(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
            return app;
        app.UseSwagger();
        app.UseSwaggerUI();
        return app;
    }
}
