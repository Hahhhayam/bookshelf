using System.Security.Cryptography;
using Application.Administration;
using Domain.Administration;

namespace Infrastructure.Security;

/// <summary>PBKDF2-SHA512 with a random salt per password. The stored value keeps its parameters: <c>iterations.salt.hash</c>.</summary>
internal sealed class Pbkdf2PasswordHasher : IPasswordHasher
{
    private const int SaltSize = 16;
    private const int HashSize = 64;
    private const int Iterations = 210_000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA512;

    public PasswordHash Hash(string password)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(password, salt, Iterations, Algorithm, HashSize);
        return new PasswordHash($"{Iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}");
    }

    public bool Verify(PasswordHash hash, string password)
    {
        if (!TryParse(hash.Value, out var iterations, out var salt, out var expected))
            return false;

        var actual = Rfc2898DeriveBytes.Pbkdf2(password, salt, iterations, Algorithm, expected.Length);
        return CryptographicOperations.FixedTimeEquals(actual, expected);
    }

    private static bool TryParse(string stored, out int iterations, out byte[] salt, out byte[] hash)
    {
        iterations = 0;
        salt = hash = [];
        var parts = stored.Split('.');
        try
        {
            if (parts.Length != 3 || !int.TryParse(parts[0], out iterations) || iterations <= 0)
                return false;
            salt = Convert.FromBase64String(parts[1]);
            hash = Convert.FromBase64String(parts[2]);
            return hash.Length > 0;
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
