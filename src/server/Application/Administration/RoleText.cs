namespace Application.Administration;

/// <summary>How a role's permissions read in an audit record.</summary>
internal static class RoleText
{
    public static string Of(Role role) => string.Join(", ", role.Permissions.Select(p => p.Code).Order());
}
