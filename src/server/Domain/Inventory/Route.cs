namespace Domain.Inventory;

public readonly record struct Route
{
    public LocationId From { get; }
    public LocationId To { get; }

    public Route(LocationId from, LocationId to)
    {
        Guard.That(from != to, "A transfer needs two different locations.");
        From = from;
        To = to;
    }
}
