namespace EndToEndTests.Hosting;

[CollectionDefinition(Name)]
public sealed class EndToEndCollection : ICollectionFixture<SqlServerFixture>
{
    public const string Name = "End-to-end";
}
