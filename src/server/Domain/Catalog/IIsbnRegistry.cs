namespace Domain.Catalog;

/// <summary>Checks ISBN uniqueness across the catalog; implemented by infrastructure.</summary>
public interface IIsbnRegistry
{
    bool IsTaken(Isbn isbn);
}
