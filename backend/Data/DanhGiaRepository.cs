using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class DanhGiaRepository : IDanhGiaRepository
{
    private readonly string _conn;
    public DanhGiaRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search, string? nhanVien)
    {
        using var db = new SqlConnection(_conn);
        var sql = @"SELECT dg.*, kh.HoTen as TenKhachHang, nv.HoTen as TenNhanVien FROM DanhGia dg 
                    LEFT JOIN KhachHang kh ON dg.SoDienThoai=kh.SoDienThoai 
                    LEFT JOIN NhanVien nv ON dg.MaNhanVien=nv.MaNhanVien";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(dg.NhanXet LIKE @s OR kh.HoTen LIKE @s OR dg.MaHoaDon LIKE @s)");
        if (!string.IsNullOrEmpty(nhanVien)) conds.Add("dg.MaNhanVien=@nhanVien");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY dg.NgayDanhGia DESC";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", nhanVien });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO DanhGia (MaHoaDon,SoDienThoai,MaNhanVien,SaoDichVu,SaoNhanVien,SaoCuaHang,NhanXet) 
              VALUES (@MaHoaDon,@SoDienThoai,@MaNhanVien,@SaoDichVu,@SaoNhanVien,@SaoCuaHang,@NhanXet)", param);
    }
}
