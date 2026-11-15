using Microsoft.Data.SqlClient;
using Testcontainers.MsSql;

namespace EndToEndTests.Hosting;

/// <summary>One SQL Server container for the whole run; every test gets a database of its own inside it.</summary>
public sealed class SqlServerFixture : IAsyncLifetime
{
    private readonly MsSqlContainer _container = new MsSqlBuilder()
        .WithImage("mcr.microsoft.com/mssql/server:2022-latest")
        .Build();

    public Task InitializeAsync() => _container.StartAsync();

    public Task DisposeAsync() => _container.DisposeAsync().AsTask();

    public string ConnectionStringForNewDatabase() =>
        new SqlConnectionStringBuilder(_container.GetConnectionString())
        {
            InitialCatalog = $"e2e_{Guid.NewGuid():N}",
            TrustServerCertificate = true,
        }.ConnectionString;
}
