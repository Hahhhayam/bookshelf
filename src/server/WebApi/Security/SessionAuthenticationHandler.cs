using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

namespace WebApi.Security;

/// <summary>Turns <c>Authorization: Bearer &lt;session token&gt;</c> into a principal with the claims in <see cref="BookstoreClaims"/>.</summary>
internal sealed class SessionAuthenticationHandler(
    IOptionsMonitor<AuthenticationSchemeOptions> options, ILoggerFactory logger, UrlEncoder encoder,
    ISessionValidator sessions) : AuthenticationHandler<AuthenticationSchemeOptions>(options, logger, encoder)
{
    public const string Scheme = "Session";
    private const string BearerPrefix = "Bearer ";

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var header = Request.Headers.Authorization.ToString();
        if (!header.StartsWith(BearerPrefix, StringComparison.OrdinalIgnoreCase))
            return AuthenticateResult.NoResult();

        var session = await sessions.ValidateAsync(header[BearerPrefix.Length..].Trim(), Context.RequestAborted);
        return session is null
            ? AuthenticateResult.Fail("The session is invalid, expired or revoked.")
            : AuthenticateResult.Success(new AuthenticationTicket(ToPrincipal(session), Scheme));
    }

    private static ClaimsPrincipal ToPrincipal(AuthenticatedSession session)
    {
        var claims = new List<Claim>
        {
            new(BookstoreClaims.UserId, session.User.Value.ToString()),
            new(BookstoreClaims.Session, session.SessionId.ToString()),
        };
        claims.AddRange(session.Permissions.Select(p => new Claim(BookstoreClaims.Permission, p.Code)));
        claims.AddRange(session.Locations.Select(l => new Claim(BookstoreClaims.Location, l.Value.ToString())));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, Scheme));
    }
}
