using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class DatLichRepository : IDatLichRepository
{
    private readonly string _conn;
    public DatLichRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search, string? trangThai, string? chiNhanh, string? nhanVien, string? khachHang)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"SELECT dl.*, cn.TenChiNhanh, nv.HoTen as TenNhanVien, kh.HoTen as TenKhachHang 
                    FROM DatLich dl LEFT JOIN ChiNhanh cn ON dl.MaChiNhanh=cn.MaChiNhanh 
                    LEFT JOIN NhanVien nv ON dl.MaNhanVien=nv.MaNhanVien 
                    LEFT JOIN KhachHang kh ON dl.SoDienThoai=kh.SoDienThoai";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(dl.MaDatLich LIKE @s OR dl.SoDienThoai LIKE @s OR kh.HoTen LIKE @s OR nv.HoTen LIKE @s)");
        if (!string.IsNullOrEmpty(trangThai)) conds.Add("dl.TrangThai = @trangThai");
        if (!string.IsNullOrEmpty(chiNhanh)) conds.Add("dl.MaChiNhanh = @chiNhanh");
        if (!string.IsNullOrEmpty(nhanVien)) conds.Add("dl.MaNhanVien = @nhanVien");
        if (!string.IsNullOrEmpty(khachHang)) conds.Add("dl.SoDienThoai = @khachHang");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY dl.ThoiGianHen DESC";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", trangThai, chiNhanh, nhanVien, khachHang });
    }

    public async Task<dynamic?> GetById(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT dl.*, cn.TenChiNhanh, nv.HoTen as TenNhanVien, kh.HoTen as TenKhachHang FROM DatLich dl 
              LEFT JOIN ChiNhanh cn ON dl.MaChiNhanh=cn.MaChiNhanh LEFT JOIN NhanVien nv ON dl.MaNhanVien=nv.MaNhanVien 
              LEFT JOIN KhachHang kh ON dl.SoDienThoai=kh.SoDienThoai WHERE dl.MaDatLich=@id", new { id });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO DatLich (MaDatLich,SoDienThoai,MaChiNhanh,MaNhanVien,ThoiGianHen,ThoiGianKetThuc,NguonDatLich,GhiChu) 
              VALUES (@MaDatLich,@SoDienThoai,@MaChiNhanh,@MaNhanVien,@ThoiGianHen,@ThoiGianKetThuc,@NguonDatLich,@GhiChu)", param);
    }

    public async Task<int> Update(string id, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE DatLich SET MaNhanVien=@MaNhanVien,ThoiGianHen=@ThoiGianHen,ThoiGianKetThuc=@ThoiGianKetThuc,TrangThai=@TrangThai,GhiChu=@GhiChu WHERE MaDatLich=@id", param);
    }

    public async Task<int> UpdateStatus(string id, string trangThai)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("UPDATE DatLich SET TrangThai=@trangThai WHERE MaDatLich=@id", new { id, trangThai });
    }

    public async Task<IEnumerable<dynamic>> GetChiTiet(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryAsync<dynamic>(
            @"SELECT ct.*, dv.TenDichVu, dv.Gia, dv.ThoiGianPhut FROM ChiTietDatLich ct 
              JOIN DichVu dv ON ct.MaDichVu=dv.MaDichVu WHERE ct.MaDatLich=@id", new { id });
    }

    public async Task<int> AddChiTiet(string maDatLich, string maDichVu, int soLuong)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            "INSERT INTO ChiTietDatLich (MaDatLich,MaDichVu,SoLuong) VALUES (@maDatLich,@maDichVu,@soLuong)",
            new { maDatLich, maDichVu, soLuong });
    }
}
