using Microsoft.Data.SqlClient;
using backend.Data;
using backend.Services;

var builder = WebApplication.CreateBuilder(args);

// Add controllers
builder.Services.AddControllers();

// Register SQL connection string
builder.Services.AddScoped<SqlConnection>(_ =>
    new SqlConnection(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repositories
builder.Services.AddScoped<IAuthRepository, AuthRepository>();
builder.Services.AddScoped<IChiNhanhRepository, ChiNhanhRepository>();
builder.Services.AddScoped<IDichVuRepository, DichVuRepository>();
builder.Services.AddScoped<IKhachHangRepository, KhachHangRepository>();
builder.Services.AddScoped<INhanVienRepository, NhanVienRepository>();
builder.Services.AddScoped<IDatLichRepository, DatLichRepository>();
builder.Services.AddScoped<IHoaDonRepository, HoaDonRepository>();
builder.Services.AddScoped<IKhuyenMaiRepository, KhuyenMaiRepository>();
builder.Services.AddScoped<ISanPhamRepository, SanPhamRepository>();
builder.Services.AddScoped<IDanhGiaRepository, DanhGiaRepository>();

// Register Services
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IChiNhanhService, ChiNhanhService>();
builder.Services.AddScoped<IDichVuService, DichVuService>();
builder.Services.AddScoped<IKhachHangService, KhachHangService>();
builder.Services.AddScoped<INhanVienService, NhanVienService>();
builder.Services.AddScoped<IDatLichService, DatLichService>();
builder.Services.AddScoped<IHoaDonService, HoaDonService>();
builder.Services.AddScoped<IKhuyenMaiService, KhuyenMaiService>();
builder.Services.AddScoped<ISanPhamService, SanPhamService>();
builder.Services.AddScoped<IDanhGiaService, DanhGiaService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();

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
