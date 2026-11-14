namespace Domain.Catalog;

/// <summary>A sellable catalog item: a book, or a product without an ISBN such as stationery.</summary>
public sealed class Book : AggregateRoot<BookId>
{
    private readonly List<AuthorId> _authors = [];

    public string Title { get; private set; }
    public Money Price { get; private set; }
    public Isbn? Isbn { get; }
    public Barcode Barcode { get; private set; }
    public ItemType ItemType { get; }
    public SaleStatus Status { get; private set; } = SaleStatus.Active;
    public bool IsActive => Status == SaleStatus.Active;
    public PublisherId? PublisherId { get; private set; }
    public CategoryId CategoryId { get; private set; }
    public IReadOnlyList<AuthorId> Authors => _authors;

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

        Guard.That(!initialPrice.IsNegative, "Price cannot be negative.");

        var book = new Book(BookId.New(), Guard.NotBlank(title), isbn, barcode, itemType, publisherId, categoryId)
        {
            Price = initialPrice,
        };
        book._authors.AddRange(authors.Distinct());
        book.Raise(new BookAdded(book.Id, initialPrice, createdBy, now));
        return book;
    }

    /// <summary>Takes effect at once. Only the current price is kept here; the history is written from the PriceChanged event.</summary>
    public void ChangePrice(Money newPrice, UserId changedBy, DateTimeOffset now)
    {
        Guard.That(!newPrice.IsNegative, "Price cannot be negative.");

        var oldPrice = Price;
        Price = newPrice;
        Raise(new PriceChanged(Id, oldPrice, newPrice, changedBy, now));
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
