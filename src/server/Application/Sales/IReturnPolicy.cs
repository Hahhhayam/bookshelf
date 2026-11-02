namespace Application.Sales;

public interface IReturnPolicy
{
    /// <summary>How long after the sale a return is still accepted.</summary>
    TimeSpan Window { get; }
}
