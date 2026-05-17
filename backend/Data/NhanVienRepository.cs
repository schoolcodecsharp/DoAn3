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

    /// <summary>
    /// Lấy lịch sử phục vụ của nhân viên: danh sách hóa đơn có liên kết đến lịch hẹn của nhân viên,
    /// kèm thông tin đánh giá (nếu có)
    /// </summary>
    public async Task<IEnumerable<dynamic>> GetServiceHistory(string maNhanVien)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"
            SELECT 
                hd.MaHoaDon, 
                kh.HoTen as TenKhachHang,
                ISNULL(
                    (SELECT STRING_AGG(dv.TenDichVu, ', ') 
                     FROM ChiTietDatLich ctdl 
                     JOIN DichVu dv ON ctdl.MaDichVu = dv.MaDichVu 
                     WHERE ctdl.MaDatLich = dl.MaDatLich),
                    N'Dịch vụ cắt tóc'
                ) as DichVu,
                hd.ThanhTien,
                hd.ThoiGianTT,
                ISNULL(dg.SaoNhanVien, 0) as SaoNhanVien,
                dg.NhanXet as NhanXetDanhGia
            FROM HoaDon hd
            INNER JOIN DatLich dl ON hd.MaDatLich = dl.MaDatLich
            LEFT JOIN KhachHang kh ON hd.SoDienThoai = kh.SoDienThoai
            LEFT JOIN DanhGia dg ON hd.MaHoaDon = dg.MaHoaDon
            WHERE dl.MaNhanVien = @maNhanVien
            ORDER BY hd.ThoiGianTT DESC";
        return await db.QueryAsync<dynamic>(sql, new { maNhanVien });
    }

    /// <summary>
    /// Lấy thống kê tháng hiện tại của nhân viên
    /// </summary>
    public async Task<dynamic> GetStaffStats(string maNhanVien)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"
            SELECT 
                (SELECT COUNT(*) FROM DatLich 
                 WHERE MaNhanVien = @maNhanVien 
                 AND TrangThai = 'HoanThanh'
                 AND MONTH(ThoiGianHen) = MONTH(GETDATE()) 
                 AND YEAR(ThoiGianHen) = YEAR(GETDATE())) as SoKhach,
                
                (SELECT ISNULL(SUM(hd.ThanhTien), 0) FROM HoaDon hd 
                 INNER JOIN DatLich dl ON hd.MaDatLich = dl.MaDatLich
                 WHERE dl.MaNhanVien = @maNhanVien
                 AND MONTH(hd.ThoiGianTT) = MONTH(GETDATE()) 
                 AND YEAR(hd.ThoiGianTT) = YEAR(GETDATE())) as DoanhThu,
                
                (SELECT ISNULL(AVG(CAST(dg.SaoNhanVien as FLOAT)), 0) FROM DanhGia dg
                 WHERE dg.MaNhanVien = @maNhanVien) as DanhGiaTB,
                
                (SELECT COUNT(*) FROM DatLich 
                 WHERE MaNhanVien = @maNhanVien 
                 AND TrangThai = 'HoanThanh') as TongKhachDaPhucVu,

                (SELECT ISNULL(SUM(hd.ThanhTien), 0) FROM HoaDon hd 
                 INNER JOIN DatLich dl ON hd.MaDatLich = dl.MaDatLich
                 WHERE dl.MaNhanVien = @maNhanVien) as TongDoanhThu";
        return await db.QueryFirstOrDefaultAsync<dynamic>(sql, new { maNhanVien }) ?? new { SoKhach = 0, DoanhThu = 0m, DanhGiaTB = 0.0, TongKhachDaPhucVu = 0, TongDoanhThu = 0m };
    }
}
