using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Security;

public static class SessionToken
{
    private const int TokenBytes = 32;

    public static string Generate() => Base64Url(RandomNumberGenerator.GetBytes(TokenBytes));

    /// <summary>Tokens are random and long, so a fast hash is enough here, unlike for passwords.</summary>
    public static string Hash(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));

    private static string Base64Url(byte[] bytes) =>
        Convert.ToBase64String(bytes).TrimEnd('=').Replace('+', '-').Replace('/', '_');
}
