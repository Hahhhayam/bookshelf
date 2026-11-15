namespace EndToEndTests.Hosting;

/// <summary>
/// Starts at the real time, so seeded promotions and sessions are valid. Every read moves it one millisecond on,
/// so things done one after another never share a timestamp and histories keep their order.
/// </summary>
public sealed class TestClock : IClock
{
    private long _ticks = DateTimeOffset.UtcNow.UtcTicks;

    public DateTimeOffset Now => new(Interlocked.Add(ref _ticks, TimeSpan.TicksPerMillisecond), TimeSpan.Zero);

    public void Advance(TimeSpan by) => Interlocked.Add(ref _ticks, by.Ticks);
}
