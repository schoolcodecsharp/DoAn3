using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class HoaDonRepository : IHoaDonRepository
{
    private readonly string _conn;
    public HoaDonRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search, string? khachHang)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"SELECT hd.*, cn.TenChiNhanh, kh.HoTen as TenKhachHang FROM HoaDon hd 
                    LEFT JOIN ChiNhanh cn ON hd.MaChiNhanh=cn.MaChiNhanh 
                    LEFT JOIN KhachHang kh ON hd.SoDienThoai=kh.SoDienThoai";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(hd.MaHoaDon LIKE @s OR hd.SoDienThoai LIKE @s OR kh.HoTen LIKE @s)");
        if (!string.IsNullOrEmpty(khachHang)) conds.Add("hd.SoDienThoai = @khachHang");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY hd.ThoiGianTT DESC";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", khachHang });
    }

    public async Task<dynamic?> GetById(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT hd.*, cn.TenChiNhanh, kh.HoTen as TenKhachHang FROM HoaDon hd 
              LEFT JOIN ChiNhanh cn ON hd.MaChiNhanh=cn.MaChiNhanh 
              LEFT JOIN KhachHang kh ON hd.SoDienThoai=kh.SoDienThoai WHERE hd.MaHoaDon=@id", new { id });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO HoaDon (MaHoaDon,SoDienThoai,MaDatLich,MaChiNhanh,MaCode,TongTien,GiamGia,ThanhTien,DiemDuocCong,DiemDaDung,PhuongThucTT,GhiChu) 
              VALUES (@MaHoaDon,@SoDienThoai,@MaDatLich,@MaChiNhanh,@MaCode,@TongTien,@GiamGia,@ThanhTien,@DiemDuocCong,@DiemDaDung,@PhuongThucTT,@GhiChu)", param);
    }

    public async Task<IEnumerable<dynamic>> GetChiTiet(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryAsync<dynamic>(
            @"SELECT ct.*, dv.TenDichVu, nv.HoTen as TenNhanVien FROM ChiTietHoaDon ct 
              JOIN DichVu dv ON ct.MaDichVu=dv.MaDichVu LEFT JOIN NhanVien nv ON ct.MaNhanVien=nv.MaNhanVien WHERE ct.MaHoaDon=@id", new { id });
    }
}
