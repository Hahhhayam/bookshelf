namespace Application.Common;

public static class Permissions
{
    public static readonly Permission CatalogEdit = new("catalog.edit");
    public static readonly Permission PriceChange = new("catalog.price");
    public static readonly Permission SalesCreate = new("sales.create");
    public static readonly Permission SalesDiscount = new("sales.discount");
    public static readonly Permission SalesCancel = new("sales.cancel");
    public static readonly Permission ReturnsCreate = new("returns.create");
    public static readonly Permission ReturnsConfirm = new("returns.confirm");
    public static readonly Permission StockAdjust = new("stock.adjust");
    public static readonly Permission TransfersManage = new("transfers.manage");
    public static readonly Permission InventoryCountManage = new("inventory.count");
    public static readonly Permission InventoryCountApprove = new("inventory.approve");
    public static readonly Permission WriteOffCreate = new("writeoff.create");
    public static readonly Permission OrdersManage = new("orders.manage");
    public static readonly Permission PurchasingManage = new("purchasing.manage");
    public static readonly Permission ReceivingConfirm = new("receiving.confirm");
    public static readonly Permission CrmManage = new("crm.manage");
    public static readonly Permission PromotionsManage = new("promotions.manage");
    public static readonly Permission UsersManage = new("users.manage");
    public static readonly Permission AuditView = new("audit.view");
    public static readonly Permission ReportsView = new("reports.view");
    public static readonly Permission ReportsChainWide = new("reports.chain");
    public static readonly Permission IntegrationsReport = new("integrations.report");
}
