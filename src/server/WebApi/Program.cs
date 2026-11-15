using System.Text.Json.Serialization;
using Application;
using Infrastructure;
using Infrastructure.Bonuses;
using Infrastructure.Notifications;
using Infrastructure.Persistence;
using Infrastructure.Scheduling;
using Microsoft.EntityFrameworkCore;
using WebApi.Errors;
using WebApi.OpenApi;
using WebApi.Security;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplication();
builder.Services.AddInfrastructure(
    options => options.UseSqlServer(builder.Configuration.GetConnectionString("Bookstore")),
    scheduling: builder.Configuration.GetSection("Scheduling").Get<ScheduledJobsOptions>());
builder.Services.Configure<SmtpOptions>(builder.Configuration.GetSection("Smtp"));
builder.Services.Configure<BonusOptions>(builder.Configuration.GetSection("Bonuses"));
AddDistributedCache(builder);
builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
builder.Services.AddBookstoreSecurity();
builder.Services.AddBookstoreSwagger();
builder.Services.AddProblemDetails();
builder.Services.AddExceptionHandler<ApiExceptionHandler>();

var app = builder.Build();
if (app.Configuration.GetValue<bool>("Database:MigrateOnStartup"))
{
    using var scope = app.Services.CreateScope();
    scope.ServiceProvider.GetRequiredService<BookstoreDbContext>().Database.Migrate();
}

app.UseExceptionHandler();
app.UseBookstoreSwagger();
if (!app.Environment.IsDevelopment())
    app.UseHsts();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.Run();

static void AddDistributedCache(WebApplicationBuilder builder)
{
    var redis = builder.Configuration.GetConnectionString("Redis");
    if (string.IsNullOrWhiteSpace(redis))
        builder.Services.AddDistributedMemoryCache();
    else
        builder.Services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration = redis;
            options.InstanceName = "bookstore:";
        });
}

/// <summary>Lets the end-to-end tests host the app with WebApplicationFactory.</summary>
public partial class Program;
