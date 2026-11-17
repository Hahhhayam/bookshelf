namespace Application.Common;

/// <summary>Permission codes. Constants, so controllers can use them in attributes; they convert to <see cref="Permission"/> implicitly.</summary>
public static class Permissions
{
    public const string CatalogEdit = "catalog.edit";
    public const string PriceChange = "catalog.price";
    public const string SalesCreate = "sales.create";
    public const string SalesDiscount = "sales.discount";
    public const string SalesCancel = "sales.cancel";
    public const string ShiftsManage = "shifts.manage";
    public const string ReturnsCreate = "returns.create";
    public const string ReturnsConfirm = "returns.confirm";
    public const string StockAdjust = "stock.adjust";
    public const string TransfersManage = "transfers.manage";
    public const string InventoryCountManage = "inventory.count";
    public const string InventoryCountApprove = "inventory.approve";
    public const string WriteOffCreate = "writeoff.create";
    public const string OrdersManage = "orders.manage";
    public const string PurchasingManage = "purchasing.manage";
    public const string ReceivingConfirm = "receiving.confirm";
    public const string CrmManage = "crm.manage";
    public const string PromotionsManage = "promotions.manage";
    public const string UsersManage = "users.manage";
    public const string LocationsManage = "locations.manage";
    public const string IntegrationsManage = "integrations.manage";
    public const string AuditView = "audit.view";
    public const string ReportsView = "reports.view";
    public const string ReportsChainWide = "reports.chain";
    public const string IntegrationsReport = "integrations.report";

    public static IReadOnlyList<string> All { get; } = typeof(Permissions).GetFields()
        .Where(field => field.IsLiteral).Select(field => (string)field.GetRawConstantValue()!).ToList();
}
