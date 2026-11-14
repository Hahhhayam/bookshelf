namespace Application.Reporting;

/// <param name="CumulativeShare">Share of revenue of this book and every book above it, from 0 to 1.</param>
public sealed record AbcEntry(BookId Book, Money Revenue, decimal CumulativeShare, AbcClass Class);
