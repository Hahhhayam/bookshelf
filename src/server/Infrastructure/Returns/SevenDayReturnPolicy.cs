using Application.Sales;

namespace Infrastructure.Returns;

internal sealed class SevenDayReturnPolicy : IReturnPolicy
{
    public TimeSpan Window { get; } = TimeSpan.FromDays(7);
}
