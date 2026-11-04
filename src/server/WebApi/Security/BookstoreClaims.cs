namespace WebApi.Security;

/// <summary>Claim types the session token must carry; the token issuer and <see cref="HttpContextCurrentUser"/> share them.</summary>
public static class BookstoreClaims
{
    public const string UserId = "sub";
    public const string Permission = "permission";
    public const string Location = "location";
}
