using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebApi.Contracts;
using WebApi.Security;

namespace WebApi.Controllers;

public sealed record RegisterCustomerRequest(string Name, string? Phone, string? Email, string CardNumber);

public sealed record UpdateCustomerContactRequest(string Name, string? Phone, string? Email);

/// <param name="Segment">With <paramref name="Customer"/>, makes the promotion a personal offer.</param>
public sealed record PromotionConditionDto(
    Guid? Book, Guid? Category, int MinimumQuantity, Guid? Segment = null, Guid? Customer = null)
{
    public PromotionCondition ToCondition() => new(
        Book is { } b ? new BookId(b) : null, Category is { } c ? new CategoryId(c) : null, new Quantity(MinimumQuantity),
        Segment is { } s ? new SegmentId(s) : null, Customer is { } p ? new CustomerId(p) : null);

    public static PromotionConditionDto From(PromotionCondition c) => new(
        c.BookId?.Value, c.CategoryId?.Value, c.MinimumQuantity.Value, c.SegmentId?.Value, c.CustomerId?.Value);
}

public sealed record CreatePromotionRequest(
    string Name, DateTimeOffset From, DateTimeOffset To, PromotionConditionDto Condition, decimal DiscountPercent,
    int Priority);

public sealed record SegmentRequest(string Name, string? Description);

public sealed record ChangeCustomerSegmentsRequest(Guid[] Segments);

[ApiController]
public sealed class CrmController : ControllerBase
{
    [RequirePermission(Permissions.CrmManage, Permissions.SalesCreate)]
    [HttpPost("customers")]
    public async Task<IActionResult> Register(
        RegisterCustomerRequest request, [FromServices] RegisterCustomerUseCase useCase, CancellationToken ct)
    {
        var contact = new ContactInfo(request.Name, request.Phone, request.Email);
        var id = await useCase.ExecuteAsync(new RegisterCustomerCommand(contact, new CustomerCard(request.CardNumber)), ct);
        return Created($"customers/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.CrmManage, Permissions.SalesCreate)]
    [HttpGet("customers/{id:guid}")]
    public async Task<IActionResult> Get(Guid id, [FromServices] GetCustomerCardUseCase useCase, CancellationToken ct) =>
        Ok(ToCard(await useCase.ExecuteAsync(new CustomerId(id), ct)));

    [RequirePermission(Permissions.CrmManage, Permissions.SalesCreate)]
    [HttpGet("customers")]
    public async Task<IActionResult> FindByCard(
        string card, [FromServices] GetCustomerCardUseCase useCase, CancellationToken ct) =>
        Ok(ToCard(await useCase.ExecuteAsync(new CustomerCard(card), ct)));

    [RequirePermission(Permissions.CrmManage)]
    [HttpPut("customers/{id:guid}")]
    public async Task<IActionResult> UpdateContact(
        Guid id, UpdateCustomerContactRequest request, [FromServices] UpdateCustomerContactUseCase useCase,
        CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(id), new ContactInfo(request.Name, request.Phone, request.Email), ct);
        return NoContent();
    }

    /// <summary>The shop's buyer has no login (see <see cref="GetBonusSummaryUseCase"/>), so this read is public.</summary>
    [AllowAnonymous]
    [HttpGet("customers/{id:guid}/bonuses")]
    public async Task<IActionResult> Bonuses(Guid id, [FromServices] GetBonusSummaryUseCase useCase, CancellationToken ct)
    {
        var summary = await useCase.ExecuteAsync(new CustomerId(id), ct);
        return Ok(new
        {
            summary.Tier, balance = summary.Account?.Balance.Points ?? 0,
            operations = (summary.Account?.Transactions ?? []).OrderByDescending(t => t.At)
                .Select(t => new { t.Kind, t.Points, t.At }),
        });
    }

    private static object ToCard(CustomerCardView view) => new
    {
        id = view.Customer.Id.Value, view.Customer.Contact.Name, view.Customer.Contact.Phone,
        view.Customer.Contact.Email, view.Customer.Tier, card = view.Customer.Card.Number,
        segments = view.Customer.Segments.Select(s => s.Value),
        bonusBalance = view.Bonuses?.Balance.Points ?? 0,
        bonusOperations = (view.Bonuses?.Transactions ?? []).OrderByDescending(t => t.At)
            .Select(t => new { t.Kind, t.Points, document = t.SourceDocumentId, t.At }),
        purchases = view.Purchases.Select(p => new
        {
            sale = p.Sale.Value, location = p.Location.Value, p.At, total = MoneyDto.From(p.Total), p.Status,
        }),
    };

    [RequirePermission(Permissions.PromotionsManage)]
    [HttpPost("promotions")]
    public async Task<IActionResult> CreatePromotion(
        CreatePromotionRequest request, [FromServices] CreatePromotionUseCase useCase, CancellationToken ct)
    {
        var command = new CreatePromotionCommand(request.Name, new Period(request.From, request.To),
            request.Condition.ToCondition(), request.DiscountPercent, request.Priority);
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"promotions/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.PromotionsManage)]
    [HttpGet("promotions")]
    public async Task<IActionResult> Promotions([FromServices] ListPromotionsUseCase useCase, CancellationToken ct) =>
        Ok((await useCase.ExecuteAsync(ct)).Select(p => new
        {
            id = p.Id.Value, p.Name, from = p.Period.Start, to = p.Period.End,
            condition = PromotionConditionDto.From(p.Condition), p.DiscountPercent, p.Priority,
        }));

    [RequirePermission(Permissions.CrmManage, Permissions.PromotionsManage)]
    [HttpGet("segments")]
    public async Task<IActionResult> Segments([FromServices] ListSegmentsUseCase useCase, CancellationToken ct) =>
        Ok((await useCase.ExecuteAsync(ct)).Select(s => new { id = s.Id.Value, s.Name, s.Description }));

    [RequirePermission(Permissions.CrmManage)]
    [HttpPost("segments")]
    public async Task<IActionResult> CreateSegment(
        SegmentRequest request, [FromServices] CreateSegmentUseCase useCase, CancellationToken ct)
    {
        var id = await useCase.ExecuteAsync(request.Name, request.Description, ct);
        return Created($"segments/{id.Value}", new { id = id.Value });
    }

    [RequirePermission(Permissions.CrmManage)]
    [HttpPut("segments/{id:guid}")]
    public async Task<IActionResult> UpdateSegment(
        Guid id, SegmentRequest request, [FromServices] UpdateSegmentUseCase useCase, CancellationToken ct)
    {
        await useCase.ExecuteAsync(new SegmentId(id), request.Name, request.Description, ct);
        return NoContent();
    }

    [RequirePermission(Permissions.CrmManage)]
    [HttpPut("customers/{id:guid}/segments")]
    public async Task<IActionResult> ChangeSegments(
        Guid id, ChangeCustomerSegmentsRequest request, [FromServices] ChangeCustomerSegmentsUseCase useCase,
        CancellationToken ct)
    {
        await useCase.ExecuteAsync(new CustomerId(id), request.Segments.Select(s => new SegmentId(s)).ToHashSet(), ct);
        return NoContent();
    }
}
