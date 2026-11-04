using Microsoft.EntityFrameworkCore.Design;

namespace Infrastructure.Persistence;

/// <summary>Used only by the EF tooling (<c>dotnet ef migrations</c>); the connection string is never opened for scaffolding.</summary>
internal sealed class BookstoreDbContextFactory : IDesignTimeDbContextFactory<BookstoreDbContext>
{
    public BookstoreDbContext CreateDbContext(string[] args)
    {
        var options = new DbContextOptionsBuilder<BookstoreDbContext>()
            .UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=Bookstore;Trusted_Connection=True;TrustServerCertificate=True")
            .Options;
        return new BookstoreDbContext(options);
    }
}
