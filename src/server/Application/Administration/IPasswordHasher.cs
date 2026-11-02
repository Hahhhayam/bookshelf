namespace Application.Administration;

public interface IPasswordHasher
{
    PasswordHash Hash(string password);

    bool Verify(PasswordHash hash, string password);
}
