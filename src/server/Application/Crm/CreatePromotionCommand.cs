namespace Application.Crm;

public sealed record CreatePromotionCommand(
    string Name, Period Period, PromotionCondition Condition, decimal DiscountPercent, int Priority);
