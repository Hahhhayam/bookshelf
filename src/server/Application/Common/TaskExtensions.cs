namespace Application.Common;

public static class TaskExtensions
{
    public static async Task<T> OrNotFound<T>(this Task<T?> task, string what) where T : class =>
        await task ?? throw new NotFoundException(what);
}
