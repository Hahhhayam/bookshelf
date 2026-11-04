using WebApi.Contracts;

namespace WebApi.Endpoints;

public sealed record AddBookRequest(
    string Title, ItemType ItemType, string Barcode, Guid Category, Guid[] Authors, Guid? Publisher, string? Isbn,
    MoneyDto Price);

public sealed record ChangeBookPriceRequest(MoneyDto NewPrice, DateTimeOffset ValidFrom);

internal static class CatalogEndpoints
{
    public static void MapCatalogEndpoints(this IEndpointRouteBuilder app)
    {
        var books = app.MapGroup("/books");
        books.MapGet("/", SearchAsync);
        books.MapPost("/", AddAsync);
        books.MapPost("/{id:guid}/price", ChangePriceAsync);
        books.MapDelete("/{id:guid}", RemoveAsync);
    }

    private static async Task<IResult> SearchAsync(
        string? text, string? isbn, Guid? author, Guid? publisher, Guid? category, Guid? availableAt,
        SearchBooksUseCase useCase, CancellationToken ct)
    {
        var query = new BookSearchQuery(
            text, isbn is null ? null : new Isbn(isbn), author is { } a ? new AuthorId(a) : null,
            publisher is { } p ? new PublisherId(p) : null, category is { } c ? new CategoryId(c) : null,
            availableAt is { } l ? new LocationId(l) : null);
        var results = await useCase.ExecuteAsync(query, ct);
        return Results.Ok(results.Select(r => new
        {
            id = r.Book.Value, r.Title, price = MoneyDto.From(r.Price),
            availability = r.Availability.Select(a => new { location = a.Location.Value, available = a.Available.Value }),
        }));
    }

    private static async Task<IResult> AddAsync(AddBookRequest request, AddBookUseCase useCase, CancellationToken ct)
    {
        var command = new AddBookCommand(
            request.Title, request.ItemType, new Barcode(request.Barcode), new CategoryId(request.Category),
            request.Authors.Select(a => new AuthorId(a)).ToList(),
            request.Publisher is { } p ? new PublisherId(p) : null,
            request.Isbn is null ? null : new Isbn(request.Isbn), request.Price.ToMoney());
        var id = await useCase.ExecuteAsync(command, ct);
        return Results.Created($"/books/{id.Value}", new { id = id.Value });
    }

    private static async Task<IResult> ChangePriceAsync(
        Guid id, ChangeBookPriceRequest request, ChangeBookPriceUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ChangeBookPriceCommand(new BookId(id), request.NewPrice.ToMoney(), request.ValidFrom), ct);
        return Results.NoContent();
    }

    private static async Task<IResult> RemoveAsync(Guid id, RemoveBookUseCase useCase, CancellationToken ct) =>
        Results.Ok(new { mode = await useCase.ExecuteAsync(new BookId(id), ct) });
}
