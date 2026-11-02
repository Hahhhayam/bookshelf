namespace Application.Catalog;

/// <summary>Adapts an already awaited repository answer to the synchronous registry the Book aggregate expects.</summary>
public sealed class KnownIsbnRegistry(bool taken) : IIsbnRegistry
{
    public bool IsTaken(Isbn isbn) => taken;
}
