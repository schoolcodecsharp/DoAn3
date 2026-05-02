using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class AuthRepository : IAuthRepository
{
    private readonly string _conn;
    public AuthRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<dynamic?> FindAdmin(string phone, string password)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT MaQuanLy, HoTen, Email, SoDienThoai, MaChiNhanh, 'admin' as VaiTro 
              FROM QuanLy WHERE SoDienThoai = @phone AND MatKhau = @password AND TrangThai = 1",
            new { phone, password });
    }

    public async Task<dynamic?> FindStaff(string phone, string password)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT MaNhanVien, HoTen, Email, SoDienThoai, MaChiNhanh, ChucVu, 'staff' as VaiTro 
              FROM NhanVien WHERE SoDienThoai = @phone AND MatKhau = @password AND TrangThai = 1",
            new { phone, password });
    }

    public async Task<dynamic?> FindUser(string phone, string password)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT SoDienThoai, HoTen, Email, GioiTinh, NgaySinh, HangThanhVien, DiemTichLuy, TongDiemTich, 'user' as VaiTro 
              FROM KhachHang WHERE SoDienThoai = @phone AND MatKhau = @password AND TrangThai = 1",
            new { phone, password });
    }

    public async Task<dynamic?> FindByPhone(string phone)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            "SELECT SoDienThoai FROM KhachHang WHERE SoDienThoai = @phone", new { phone });
    }

    public async Task<int> CreateCustomer(string soDienThoai, string hoTen, string gioiTinh, DateTime? ngaySinh, string? email, string matKhau)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO KhachHang (SoDienThoai, HoTen, GioiTinh, NgaySinh, Email, MatKhau) 
              VALUES (@soDienThoai, @hoTen, @gioiTinh, @ngaySinh, @email, @matKhau)",
            new { soDienThoai, hoTen, gioiTinh, ngaySinh, email, matKhau });
    }
}
