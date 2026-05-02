using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class KhuyenMaiRepository : IKhuyenMaiRepository
{
    private readonly string _conn;
    public KhuyenMaiRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search)
    {
        using var db = new SqlConnection(_conn);
        var sql = "SELECT * FROM KhuyenMai";
        if (!string.IsNullOrEmpty(search))
            sql += " WHERE MaCode LIKE @s OR TenKhuyenMai LIKE @s";
        sql += " ORDER BY NgayBatDau DESC";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%" });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO KhuyenMai (MaCode,TenKhuyenMai,LoaiGiam,GiaTriGiam,GiaTriToiDa,DonHangToiThieu,SoLanToiDa,NgayBatDau,NgayKetThuc) 
              VALUES (@MaCode,@TenKhuyenMai,@LoaiGiam,@GiaTriGiam,@GiaTriToiDa,@DonHangToiThieu,@SoLanToiDa,@NgayBatDau,@NgayKetThuc)", param);
    }

    public async Task<int> Update(string code, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE KhuyenMai SET TenKhuyenMai=@TenKhuyenMai,LoaiGiam=@LoaiGiam,GiaTriGiam=@GiaTriGiam,GiaTriToiDa=@GiaTriToiDa,
              DonHangToiThieu=@DonHangToiThieu,SoLanToiDa=@SoLanToiDa,NgayBatDau=@NgayBatDau,NgayKetThuc=@NgayKetThuc,TrangThai=@TrangThai WHERE MaCode=@code", param);
    }

    public async Task<int> Delete(string code)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("DELETE FROM KhuyenMai WHERE MaCode=@code", new { code });
    }
}
