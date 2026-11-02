namespace Domain.Catalog;

/// <summary>A sellable catalog item: a book, or a product without an ISBN such as stationery.</summary>
public sealed class Book : AggregateRoot<BookId>
{
    private readonly List<AuthorId> _authors = [];
    private readonly List<PriceEntry> _prices = [];

    public string Title { get; private set; }
    public Isbn? Isbn { get; }
    public Barcode Barcode { get; private set; }
    public ItemType ItemType { get; }
    public SaleStatus Status { get; private set; } = SaleStatus.Active;
    public bool IsActive => Status == SaleStatus.Active;
    public PublisherId? PublisherId { get; private set; }
    public CategoryId CategoryId { get; private set; }
    public IReadOnlyList<AuthorId> Authors => _authors;
    public IReadOnlyList<PriceEntry> PriceHistory => _prices;

    private Book(BookId id, string title, Isbn? isbn, Barcode barcode, ItemType itemType,
        PublisherId? publisherId, CategoryId categoryId) : base(id)
    {
        Title = title;
        Isbn = isbn;
        Barcode = barcode;
        ItemType = itemType;
        PublisherId = publisherId;
        CategoryId = categoryId;
    }

    public static Book Create(string title, ItemType itemType, Barcode barcode, CategoryId categoryId,
        IEnumerable<AuthorId> authors, PublisherId? publisherId, Isbn? isbn,
        Money initialPrice, DateTimeOffset now, UserId createdBy, IIsbnRegistry isbnRegistry)
    {
        if (isbn is { } value)
            Guard.That(!isbnRegistry.IsTaken(value), $"ISBN {value} already exists in the catalog.");

        var book = new Book(BookId.New(), Guard.NotBlank(title), isbn, barcode, itemType, publisherId, categoryId);
        book._authors.AddRange(authors.Distinct());
        book._prices.Add(new PriceEntry(initialPrice, now, createdBy));
        return book;
    }

    public Money CurrentPrice(DateTimeOffset at)
    {
        var entry = _prices.Where(p => p.ValidFrom <= at).MaxBy(p => p.ValidFrom);
        return entry?.Price ?? throw new DomainException("The item has no price valid at the given moment.");
    }

    /// <summary>Appends a new price entry; the old value stays in the history and a PriceChanged event is raised for audit.</summary>
    public void ChangePrice(Money newPrice, DateTimeOffset validFrom, UserId changedBy, DateTimeOffset now)
    {
        var latest = _prices.MaxBy(p => p.ValidFrom)!;
        Guard.That(validFrom > latest.ValidFrom, "A new price must be valid from a later moment than the current one.");

        _prices.Add(new PriceEntry(newPrice, validFrom, changedBy));
        Raise(new PriceChanged(Id, latest.Price, newPrice, validFrom, changedBy, now));
    }

    public void UpdateDetails(string title, Barcode barcode, CategoryId categoryId,
        IEnumerable<AuthorId> authors, PublisherId? publisherId)
    {
        Title = Guard.NotBlank(title);
        Barcode = barcode;
        CategoryId = categoryId;
        PublisherId = publisherId;
        _authors.Clear();
        _authors.AddRange(authors.Distinct());
    }

    /// <summary>An item with active orders, reservations or unfulfilled deliveries is deactivated, not deleted.</summary>
    public static RemovalMode DecideRemoval(bool hasActiveCommitments) =>
        hasActiveCommitments ? RemovalMode.Deactivate : RemovalMode.Delete;

    public void Deactivate() => Status = SaleStatus.Deactivated;

    public void Activate() => Status = SaleStatus.Active;
}
