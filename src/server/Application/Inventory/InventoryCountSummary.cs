namespace Application.Inventory;

/// <summary>A row of the count list: how far counting has got.</summary>
public sealed record InventoryCountSummary(
    InventoryCountId Count, LocationId Location, CountStatus Status, DateTimeOffset StartedAt, int Lines, int Counted);
