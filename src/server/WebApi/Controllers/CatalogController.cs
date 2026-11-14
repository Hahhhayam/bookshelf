using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record AddBookRequest(
    string Title, ItemType ItemType, string Barcode, Guid Category, Guid[] Authors, Guid? Publisher, string? Isbn,
    MoneyDto Price);

public sealed record ChangeBookPriceRequest(MoneyDto NewPrice);

public sealed record UpdateBookDetailsRequest(string Title, string Barcode, Guid Category, Guid[] Authors, Guid? Publisher);

[ApiController]
public sealed class CatalogController : ControllerBase
{
    [AllowAnonymous]
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

    [AllowAnonymous]
    [HttpGet("books/{id:guid}")]
    public async Task<IActionResult> Get(Guid id, [FromServices] GetBookUseCase useCase, CancellationToken ct)
    {
        var (d, availability) = await useCase.ExecuteAsync(new BookId(id), ct);
        return Ok(new
        {
            id = d.Book.Value, d.Title, price = MoneyDto.From(d.Price), isbn = d.Isbn?.Value, barcode = d.Barcode.Value,
            d.ItemType, d.Status, publisher = d.Publisher?.Value, category = d.Category.Value,
            authors = d.Authors.Select(a => a.Value),
            availability = availability.Select(a => new { location = a.Location.Value, available = a.Available.Value }),
        });
    }

    [RequirePermission(Permissions.CatalogEdit)]
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

    [RequirePermission(Permissions.PriceChange)]
    [HttpPost("books/{id:guid}/price")]
    public async Task<IActionResult> ChangePrice(
        Guid id, ChangeBookPriceRequest request, [FromServices] ChangeBookPriceUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new ChangeBookPriceCommand(new BookId(id), request.NewPrice.ToMoney()), ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpDelete("books/{id:guid}")]
    public async Task<IActionResult> Remove(Guid id, [FromServices] RemoveBookUseCase useCase, CancellationToken ct) =>
        Ok(new { mode = await useCase.ExecuteAsync(new BookId(id), ct) });

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPut("books/{id:guid}")]
    public async Task<IActionResult> UpdateDetails(
        Guid id, UpdateBookDetailsRequest request, [FromServices] UpdateBookDetailsUseCase useCase, CancellationToken ct)
    {
        var command = new UpdateBookDetailsCommand(
            new BookId(id), request.Title, new Barcode(request.Barcode), new CategoryId(request.Category),
            request.Authors.Select(a => new AuthorId(a)).ToList(),
            request.Publisher is { } p ? new PublisherId(p) : null);
        await useCase.ExecuteAsync(command, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPost("authors")]
    public async Task<IActionResult> CreateAuthor(
        NameRequest request, [FromServices] CreateAuthorUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Name, ct);
        return Created($"authors/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPut("authors/{id:guid}")]
    public async Task<IActionResult> RenameAuthor(
        Guid id, NameRequest request, [FromServices] RenameAuthorUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new AuthorId(id), request.Name, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPut("authors/{id:guid}/active")]
    public async Task<IActionResult> SetAuthorActive(
        Guid id, SetActiveRequest request, [FromServices] SetAuthorActiveUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new AuthorId(id), request.Active, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPost("publishers")]
    public async Task<IActionResult> CreatePublisher(
        NameRequest request, [FromServices] CreatePublisherUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Name, ct);
        return Created($"publishers/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPut("publishers/{id:guid}")]
    public async Task<IActionResult> RenamePublisher(
        Guid id, NameRequest request, [FromServices] RenamePublisherUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new PublisherId(id), request.Name, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPut("publishers/{id:guid}/active")]
    public async Task<IActionResult> SetPublisherActive(
        Guid id, SetActiveRequest request, [FromServices] SetPublisherActiveUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new PublisherId(id), request.Active, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPost("categories")]
    public async Task<IActionResult> CreateCategory(
        NameRequest request, [FromServices] CreateCategoryUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Name, ct);
        return Created($"categories/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.CatalogEdit)]
    [HttpPut("categories/{id:guid}")]
    public async Task<IActionResult> RenameCategory(
        Guid id, NameRequest request, [FromServices] RenameCategoryUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CategoryId(id), request.Name, ct);
        return NoContent();
    }
}
