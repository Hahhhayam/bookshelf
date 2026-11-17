using System.Globalization;

namespace Application.Crm;

public sealed record CreatePromotionCommand(
    string Name, Period Period, PromotionCondition Condition, decimal DiscountPercent, int Priority);

public sealed class CreatePromotionUseCase(
    IPromotionRepository promotions, ISegmentRepository segments, ICustomerRepository customers, ICurrentUser user,
    AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<PromotionId> ExecuteAsync(CreatePromotionCommand command, CancellationToken ct)
    {
        user.Require(Permissions.PromotionsManage);
        await EnsureAudienceExistsAsync(command.Condition, ct);

        var promotion = Promotion.Create(command.Name, command.Period, command.Condition,
            command.DiscountPercent, command.Priority);
        promotions.Add(promotion);
        audit.Record("promotion.created", promotion.Id.ToString(), FieldChange.Set("name", promotion.Name),
            FieldChange.Set("discountPercent", promotion.DiscountPercent.ToString(CultureInfo.InvariantCulture)));
        await unitOfWork.CommitAsync(ct);
        return promotion.Id;
    }

    private async Task EnsureAudienceExistsAsync(PromotionCondition condition, CancellationToken ct)
    {
        if (condition.SegmentId is { } segment)
            await segments.GetAsync(segment, ct).OrNotFound("Segment");
        if (condition.CustomerId is { } customer)
            await customers.GetAsync(customer, ct).OrNotFound("Customer");
    }
}
