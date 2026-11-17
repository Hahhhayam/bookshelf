namespace Application.Administration;

/// <param name="ByLogin">The login of the user who acted, so the log names them; null for a system action.</param>
public sealed record AuditEntry(AuditRecord Record, string? ByLogin);
