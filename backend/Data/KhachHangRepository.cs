using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class KhachHangRepository : IKhachHangRepository
{
    private readonly string _conn;
    public KhachHangRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search)
    {
        using var db = new SqlConnection(_conn);
        var sql = "SELECT * FROM KhachHang";
        if (!string.IsNullOrEmpty(search))
            sql += " WHERE HoTen LIKE @s OR SoDienThoai LIKE @s OR Email LIKE @s";
        sql += " ORDER BY NgayDangKy DESC";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%" });
    }

    public async Task<dynamic?> GetById(string sdt)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>("SELECT * FROM KhachHang WHERE SoDienThoai = @sdt", new { sdt });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO KhachHang (SoDienThoai, HoTen, GioiTinh, NgaySinh, Email, MatKhau) 
              VALUES (@SoDienThoai, @HoTen, @GioiTinh, @NgaySinh, @Email, @MatKhau)", param);
    }

    public async Task<int> Update(string sdt, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE KhachHang SET HoTen=@HoTen, GioiTinh=@GioiTinh, NgaySinh=@NgaySinh, Email=@Email,
              HangThanhVien=@HangThanhVien, DiemTichLuy=@DiemTichLuy, TongDiemTich=@TongDiemTich, TrangThai=@TrangThai 
              WHERE SoDienThoai=@sdt", param);
    }

    public async Task<int> Delete(string sdt)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("DELETE FROM KhachHang WHERE SoDienThoai = @sdt", new { sdt });
    }

    /// <summary>
    /// Cộng điểm được cộng và trừ điểm đã dùng cho khách hàng
    /// DiemTichLuy = DiemTichLuy + diemCong - diemDung
    /// TongDiemTich = TongDiemTich + diemCong (chỉ tăng, không giảm)
    /// </summary>
    public async Task<int> UpdatePoints(string sdt, int diemCong, int diemDung)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE KhachHang 
              SET DiemTichLuy = DiemTichLuy + @diemCong - @diemDung,
                  TongDiemTich = TongDiemTich + @diemCong
              WHERE SoDienThoai = @sdt", new { sdt, diemCong, diemDung });
    }

    /// <summary>
    /// Cập nhật hạng thành viên dựa trên TongDiemTich:
    /// 0 = Thường (< 100 điểm)
    /// 1 = Bạc (100-499 điểm)
    /// 2 = Vàng (500-999 điểm) 
    /// 3 = Kim cương (>= 1000 điểm)
    /// </summary>
    public async Task<int> UpdateMembership(string sdt)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE KhachHang SET HangThanhVien = 
                CASE 
                    WHEN TongDiemTich >= 1000 THEN 3
                    WHEN TongDiemTich >= 500 THEN 2
                    WHEN TongDiemTich >= 100 THEN 1
                    ELSE 0
                END
              WHERE SoDienThoai = @sdt", new { sdt });
    }
}
