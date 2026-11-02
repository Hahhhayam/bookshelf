namespace Application.Common;

public interface IClock
{
    DateTimeOffset Now { get; }
}
