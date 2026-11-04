namespace WebApi.Endpoints;

public static class EndpointRouteBuilderExtensions
{
    public static IEndpointRouteBuilder MapBookstoreEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapAdministrationEndpoints();
        app.MapCatalogEndpoints();
        app.MapCrmEndpoints();
        app.MapInventoryEndpoints();
        app.MapOrdersEndpoints();
        app.MapPurchasingEndpoints();
        app.MapSalesEndpoints();
        app.MapReportingEndpoints();
        return app;
    }
}
