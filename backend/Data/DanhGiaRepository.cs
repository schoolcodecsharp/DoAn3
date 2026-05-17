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
        var sql = @"SELECT dg.*, kh.HoTen as TenKhachHang, 
                    COALESCE(nv.HoTen, nv2.HoTen) as TenNhanVien,
                    COALESCE(dg.MaNhanVien, dl.MaNhanVien) as MaNhanVienThucTe
                    FROM DanhGia dg 
                    LEFT JOIN KhachHang kh ON dg.SoDienThoai=kh.SoDienThoai 
                    LEFT JOIN NhanVien nv ON dg.MaNhanVien=nv.MaNhanVien
                    LEFT JOIN HoaDon hd ON dg.MaHoaDon=hd.MaHoaDon
                    LEFT JOIN DatLich dl ON hd.MaDatLich=dl.MaDatLich
                    LEFT JOIN NhanVien nv2 ON dl.MaNhanVien=nv2.MaNhanVien";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(dg.NhanXet LIKE @s OR kh.HoTen LIKE @s OR dg.MaHoaDon LIKE @s)");
        if (!string.IsNullOrEmpty(nhanVien)) conds.Add("(dg.MaNhanVien=@nhanVien OR dl.MaNhanVien=@nhanVien)");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY dg.NgayDanhGia DESC";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", nhanVien });
    }

    public async Task<dynamic?> GetByHoaDon(string maHoaDon)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>(
            @"SELECT dg.*, kh.HoTen as TenKhachHang, 
              COALESCE(nv.HoTen, nv2.HoTen) as TenNhanVien
              FROM DanhGia dg 
              LEFT JOIN KhachHang kh ON dg.SoDienThoai=kh.SoDienThoai 
              LEFT JOIN NhanVien nv ON dg.MaNhanVien=nv.MaNhanVien
              LEFT JOIN HoaDon hd ON dg.MaHoaDon=hd.MaHoaDon
              LEFT JOIN DatLich dl ON hd.MaDatLich=dl.MaDatLich
              LEFT JOIN NhanVien nv2 ON dl.MaNhanVien=nv2.MaNhanVien
              WHERE dg.MaHoaDon=@maHoaDon", new { maHoaDon });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO DanhGia (MaHoaDon,SoDienThoai,MaNhanVien,SaoDichVu,SaoNhanVien,SaoCuaHang,NhanXet) 
              VALUES (@MaHoaDon,@SoDienThoai,@MaNhanVien,@SaoDichVu,@SaoNhanVien,@SaoCuaHang,@NhanXet)", param);
    }
}
