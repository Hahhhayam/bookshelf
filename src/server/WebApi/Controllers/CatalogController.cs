using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;

namespace WebApi.Controllers;

public sealed record AddBookRequest(
    string Title, ItemType ItemType, string Barcode, Guid Category, Guid[] Authors, Guid? Publisher, string? Isbn,
    MoneyDto Price);

public sealed record ChangeBookPriceRequest(MoneyDto NewPrice, DateTimeOffset ValidFrom);

[ApiController]
public sealed class CatalogController : ControllerBase
{
    [HttpGet("books")]
    public async Task<IActionResult> Search(
        string? text, string? isbn, Guid? author, Guid? publisher, Guid? category, Guid? availableAt,
        [FromServices] SearchBooksUseCase useCase, CancellationToken ct)
    {
        var query = new BookSearchQuery(
            text, isbn is null ? null : new Isbn(isbn), author is { } a ? new AuthorId(a) : null,
            publisher is { } p ? new PublisherId(p) : null, category is { } c ? new CategoryId(c) : null,
            availableAt is { } l ? new LocationId(l) : null);
        var results = await useCase.ExecuteAsync(query, ct);
        return Ok(results.Select(r => new
        {
            id = r.Book.Value, r.Title, price = MoneyDto.From(r.Price),
            availability = r.Availability.Select(a => new { location = a.Location.Value, available = a.Available.Value }),
        }));
    }

    [HttpPost("books")]
    public async Task<IActionResult> Add(AddBookRequest request, [FromServices] AddBookUseCase useCase, CancellationToken ct)
    {
        var command = new AddBookCommand(
            request.Title, request.ItemType, new Barcode(request.Barcode), new CategoryId(request.Category),
            request.Authors.Select(a => new AuthorId(a)).ToList(),
            request.Publisher is { } p ? new PublisherId(p) : null,
            request.Isbn is null ? null : new Isbn(request.Isbn), request.Price.ToMoney());
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"books/{id.Value}", new { id = id.Value });
    }

    [HttpPost("books/{id:guid}/price")]
    public async Task<IActionResult> ChangePrice(
        Guid id, ChangeBookPriceRequest request, [FromServices] ChangeBookPriceUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ChangeBookPriceCommand(new BookId(id), request.NewPrice.ToMoney(), request.ValidFrom), ct);
        return NoContent();
    }

    [HttpDelete("books/{id:guid}")]
    public async Task<IActionResult> Remove(Guid id, [FromServices] RemoveBookUseCase useCase, CancellationToken ct) =>
        Ok(new { mode = await useCase.ExecuteAsync(new BookId(id), ct) });
}
