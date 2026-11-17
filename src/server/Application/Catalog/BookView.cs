namespace Application.Catalog;

/// <param name="ScheduledPrice">A price decided to start later, if any; never cached, like availability.</param>
public sealed record BookView(
    BookDetails Details, IReadOnlyList<LocationAvailability> Availability, ScheduledPrice? ScheduledPrice);
