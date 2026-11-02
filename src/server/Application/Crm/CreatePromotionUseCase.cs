namespace Application.Crm;

public sealed record CreatePromotionCommand(
    string Name, Period Period, PromotionCondition Condition, decimal DiscountPercent, int Priority);

public sealed class CreatePromotionUseCase(
    IPromotionRepository promotions, ICurrentUser user, AuditTrail audit, IUnitOfWork unitOfWork)
{
    public async Task<PromotionId> ExecuteAsync(CreatePromotionCommand command, CancellationToken ct)
    {
        user.Require(Permissions.PromotionsManage);

        var promotion = Promotion.Create(command.Name, command.Period, command.Condition,
            command.DiscountPercent, command.Priority);
        promotions.Add(promotion);
        audit.Record("promotion.created", promotion.Id.ToString(), after: $"{promotion.Name}, {promotion.DiscountPercent}%");
        await unitOfWork.CommitAsync(ct);
        return promotion.Id;
    }
}
