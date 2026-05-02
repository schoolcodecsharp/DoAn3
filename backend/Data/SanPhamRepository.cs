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
}
