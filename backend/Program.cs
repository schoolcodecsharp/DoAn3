using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Register SQL connection string
builder.Services.AddScoped<SqlConnection>(_ =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// CORS - allow frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

app.MapControllers();

// Health check
app.MapGet("/api/health", () => Results.Json(new { status = "OK", message = "Server dang chay!" }));

// Run on port 5000
app.Run("http://0.0.0.0:5000");
