namespace Application.Sales;

public sealed record CreateReturnCommand(
    SaleId Sale, IReadOnlyList<ItemQuantity> Items, ReturnReason Reason, ItemCondition Condition);
