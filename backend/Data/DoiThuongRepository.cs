using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class DoiThuongRepository : IDoiThuongRepository
{
    private readonly string _conn;
    public DoiThuongRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetBySoDienThoai(string soDienThoai)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"
            SELECT 
                dt.MaDoiThuong,
                dt.SoDienThoai,
                dt.DiemDaDoi,
                dt.MaCode,
                dt.TrangThai,
                dt.NgayDoiThuong,
                dt.NgayHetHan,
                dt.NgaySuDung,
                km.TenKhuyenMai,
                km.GiaTriGiam,
                km.LoaiGiam
            FROM LichSuDoiThuong dt
            LEFT JOIN KhuyenMai km ON dt.MaCode = km.MaCode
            WHERE dt.SoDienThoai = @soDienThoai
            ORDER BY dt.NgayDoiThuong DESC";
        return await db.QueryAsync<dynamic>(sql, new { soDienThoai });
    }

    public async Task<dynamic?> GetById(string maDoiThuong)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"
            SELECT 
                dt.*,
                km.TenKhuyenMai,
                km.GiaTriGiam,
                km.LoaiGiam
            FROM LichSuDoiThuong dt
            LEFT JOIN KhuyenMai km ON dt.MaCode = km.MaCode
            WHERE dt.MaDoiThuong = @maDoiThuong";
        return await db.QueryFirstOrDefaultAsync<dynamic>(sql, new { maDoiThuong });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO LichSuDoiThuong (MaDoiThuong, SoDienThoai, DiemDaDoi, MaCode, TrangThai, NgayDoiThuong, NgayHetHan) 
              VALUES (@MaDoiThuong, @SoDienThoai, @DiemDaDoi, @MaCode, @TrangThai, @NgayDoiThuong, @NgayHetHan)", param);
    }

    public async Task<int> UpdateTrangThai(string maDoiThuong, string trangThai, DateTime? ngaySuDung = null)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE LichSuDoiThuong 
              SET TrangThai = @trangThai, NgaySuDung = @ngaySuDung 
              WHERE MaDoiThuong = @maDoiThuong", 
            new { maDoiThuong, trangThai, ngaySuDung });
    }
}
