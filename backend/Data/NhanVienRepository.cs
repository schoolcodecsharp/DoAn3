using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class NhanVienRepository : INhanVienRepository
{
    private readonly string _conn;
    public NhanVienRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh)
    {
        using var db = new SqlConnection(_conn);
        var sql = "SELECT nv.*, cn.TenChiNhanh FROM NhanVien nv LEFT JOIN ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(nv.HoTen LIKE @s OR nv.MaNhanVien LIKE @s OR nv.SoDienThoai LIKE @s OR nv.ChucVu LIKE @s)");
        if (!string.IsNullOrEmpty(chiNhanh)) conds.Add("nv.MaChiNhanh = @chiNhanh");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY nv.MaNhanVien";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", chiNhanh });
    }

    public async Task<dynamic?> GetById(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT nv.*, cn.TenChiNhanh FROM NhanVien nv LEFT JOIN ChiNhanh cn ON nv.MaChiNhanh = cn.MaChiNhanh 
              WHERE nv.MaNhanVien = @id", new { id });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO NhanVien (MaNhanVien, MaChiNhanh, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, ChucVu, LuongCoBan, MatKhau) 
              VALUES (@MaNhanVien, @MaChiNhanh, @HoTen, @GioiTinh, @NgaySinh, @SoDienThoai, @Email, @ChucVu, @LuongCoBan, @MatKhau)", param);
    }

    public async Task<int> Update(string id, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE NhanVien SET MaChiNhanh=@MaChiNhanh, HoTen=@HoTen, GioiTinh=@GioiTinh, NgaySinh=@NgaySinh,
              SoDienThoai=@SoDienThoai, Email=@Email, ChucVu=@ChucVu, LuongCoBan=@LuongCoBan, TrangThai=@TrangThai 
              WHERE MaNhanVien=@id", param);
    }

    public async Task<int> Delete(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("DELETE FROM NhanVien WHERE MaNhanVien = @id", new { id });
    }
}
