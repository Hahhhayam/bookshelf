using Application.Administration;
using Domain.Administration;

namespace Infrastructure.Persistence.Repositories.Administration;

internal sealed class UserRepository(BookstoreDbContext db) : IUserRepository
{
    public Task<User?> GetAsync(UserId id, CancellationToken ct) =>
        db.Set<User>().FirstOrDefaultAsync(u => u.Id == id, ct);

    public Task<User?> FindByLoginAsync(string login, CancellationToken ct) =>
        db.Set<User>().FirstOrDefaultAsync(u => u.Login == login, ct);

    public void Add(User user) => db.Set<User>().Add(user);
}
