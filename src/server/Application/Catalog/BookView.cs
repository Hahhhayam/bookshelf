namespace Application.Catalog;

public sealed record BookView(BookDetails Details, IReadOnlyList<LocationAvailability> Availability);
