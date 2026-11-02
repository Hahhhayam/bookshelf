namespace Application.Common;

/// <summary>The authenticated employee of the current request, with rights resolved from role and location access.</summary>
public interface ICurrentUser
{
    UserId Id { get; }

    bool Has(Permission permission);

    bool CanAccess(LocationId location);
}
