namespace Application.Purchasing;

public sealed record RecordMissingBookCommand(string Title, string? Author, LocationId Location, CustomerId? Customer);
