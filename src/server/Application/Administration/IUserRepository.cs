namespace Application.Administration;

public interface IUserRepository
{
    Task<User?> GetAsync(UserId id, CancellationToken ct);

    Task<User?> FindByLoginAsync(string login, CancellationToken ct);

    void Add(User user);
}
