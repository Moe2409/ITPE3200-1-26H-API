using Microsoft.EntityFrameworkCore;
using Gremlin.DAL;
using Scalar.AspNetCore;
using Serilog;
using Serilog.Events;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers().AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = // Prevents circular reference exceptions
            System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddOpenApi(); // 2. Native .NET OpenAPI Support

builder.Services.AddDbContext<GremlinDbContext>(options =>
{
    options.UseSqlite(builder.Configuration.GetConnectionString("GremlinDbContextConnection"));
});

builder.Services.AddCors(options => // CORS Policy for React Frontend Integration
{
    options.AddPolicy("CorsPolicy", policy =>
        policy.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost") // Allows any port on localhost
              .AllowAnyMethod().AllowAnyHeader().AllowCredentials());
});

builder.Services.AddScoped<IQuizRepository, QuizRepository>();

builder.Services.AddIdentity<IdentityUser, IdentityRole>(options =>
{
    // Optional password/signin settings if you need them:
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
.AddEntityFrameworkStores<GremlinDbContext>()
.AddDefaultTokenProviders();

// builder.Services.AddScoped<IItemRepository, GremlinRepository>();

var loggerConfiguration = new LoggerConfiguration()
    .MinimumLevel.Warning()
    .WriteTo.File($"Logs/api_{DateTime.Now:yyyyMMdd_HHmmss}.log");

var logger = loggerConfiguration.CreateLogger();
builder.Logging.AddSerilog(logger);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    DBInit.Seed(app);
    app.MapOpenApi(); // Serve modern OpenAPI document endpoint (/openapi/v1.json)
    app.MapScalarApiReference(); // Serve Scalar Interactive API Documentation UI (/scalar/v1)
}

app.UseCors("CorsPolicy");
app.MapStaticAssets();
app.MapControllers();

app.Run();