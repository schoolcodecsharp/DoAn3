using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class SanPhamRepository : ISanPhamRepository
{
    private readonly string _conn;
    public SanPhamRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh)
    {
        using var db = new SqlConnection(_conn);
        var sql = "SELECT sp.*, cn.TenChiNhanh FROM SanPhamTonKho sp LEFT JOIN ChiNhanh cn ON sp.MaChiNhanh=cn.MaChiNhanh";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(sp.TenSanPham LIKE @s OR sp.ThuongHieu LIKE @s OR sp.MaSanPham LIKE @s)");
        if (!string.IsNullOrEmpty(chiNhanh)) conds.Add("sp.MaChiNhanh=@chiNhanh");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY sp.MaSanPham";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", chiNhanh });
    }

    public async Task<dynamic?> GetById(string maSanPham, string maChiNhanh)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT sp.*, cn.TenChiNhanh FROM SanPhamTonKho sp 
              LEFT JOIN ChiNhanh cn ON sp.MaChiNhanh=cn.MaChiNhanh 
              WHERE sp.MaSanPham=@maSanPham AND sp.MaChiNhanh=@maChiNhanh", new { maSanPham, maChiNhanh });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO SanPhamTonKho (MaSanPham,MaChiNhanh,TenSanPham,ThuongHieu,DanhMuc,GiaNhap,GiaBan,SoLuong,SoLuongToiThieu) 
              VALUES (@MaSanPham,@MaChiNhanh,@TenSanPham,@ThuongHieu,@DanhMuc,@GiaNhap,@GiaBan,@SoLuong,@SoLuongToiThieu)", param);
    }

    public async Task<int> Update(string maSanPham, string maChiNhanh, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE SanPhamTonKho SET TenSanPham=@TenSanPham,ThuongHieu=@ThuongHieu,DanhMuc=@DanhMuc,
              GiaNhap=@GiaNhap,GiaBan=@GiaBan,SoLuong=@SoLuong,SoLuongToiThieu=@SoLuongToiThieu,TrangThai=@TrangThai,
              NgayCapNhat=GETDATE()
              WHERE MaSanPham=@MaSanPham AND MaChiNhanh=@MaChiNhanh", param);
    }

    public async Task<int> Delete(string maSanPham, string maChiNhanh)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("DELETE FROM SanPhamTonKho WHERE MaSanPham=@maSanPham AND MaChiNhanh=@maChiNhanh", new { maSanPham, maChiNhanh });
    }

    /// <summary>
    /// Lấy danh sách sản phẩm có SoLuong <= SoLuongToiThieu (cảnh báo tồn kho thấp)
    /// </summary>
    public async Task<IEnumerable<dynamic>> GetLowStock(string? chiNhanh)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"SELECT sp.*, cn.TenChiNhanh FROM SanPhamTonKho sp 
                    LEFT JOIN ChiNhanh cn ON sp.MaChiNhanh=cn.MaChiNhanh 
                    WHERE sp.SoLuong <= sp.SoLuongToiThieu AND sp.TrangThai = 1";
        if (!string.IsNullOrEmpty(chiNhanh)) sql += " AND sp.MaChiNhanh=@chiNhanh";
        sql += " ORDER BY sp.SoLuong ASC";
        return await db.QueryAsync<dynamic>(sql, new { chiNhanh });
    }
}
