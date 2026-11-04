using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers;

public sealed record RegisterCustomerRequest(string Name, string? Phone, string? Email, string CardNumber);

public sealed record PromotionConditionDto(Guid? Book, Guid? Category, int MinimumQuantity);

public sealed record CreatePromotionRequest(
    string Name, DateTimeOffset From, DateTimeOffset To, PromotionConditionDto Condition, decimal DiscountPercent,
    int Priority);

[ApiController]
public sealed class CrmController : ControllerBase
{
    [HttpPost("customers")]
    public async Task<IActionResult> Register(
        RegisterCustomerRequest request, [FromServices] RegisterCustomerUseCase useCase, CancellationToken ct)
    {
        var contact = new ContactInfo(request.Name, request.Phone, request.Email);
        var id = await useCase.ExecuteAsync(new RegisterCustomerCommand(contact, new CustomerCard(request.CardNumber)), ct);
        return Created($"customers/{id.Value}", new { id = id.Value });
    }

    [HttpPost("promotions")]
    public async Task<IActionResult> CreatePromotion(
        CreatePromotionRequest request, [FromServices] CreatePromotionUseCase useCase, CancellationToken ct)
    {
        var condition = new PromotionCondition(
            request.Condition.Book is { } b ? new BookId(b) : null,
            request.Condition.Category is { } c ? new CategoryId(c) : null,
            new Quantity(request.Condition.MinimumQuantity));
        var command = new CreatePromotionCommand(
            request.Name, new Period(request.From, request.To), condition, request.DiscountPercent, request.Priority);
        var id = await useCase.ExecuteAsync(command, ct);
        return Created($"promotions/{id.Value}", new { id = id.Value });
    }
}
