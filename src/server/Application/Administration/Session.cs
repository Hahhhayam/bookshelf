namespace Application.Administration;

public sealed record Session(string Token, DateTimeOffset ExpiresAt);
