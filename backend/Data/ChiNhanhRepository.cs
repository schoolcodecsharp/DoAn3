using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class ChiNhanhRepository : IChiNhanhRepository
{
    private readonly string _conn;
    public ChiNhanhRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search)
    {
        using var db = new SqlConnection(_conn);
        var sql = "SELECT * FROM ChiNhanh";
        if (!string.IsNullOrEmpty(search))
            sql += " WHERE TenChiNhanh LIKE @s OR DiaChi LIKE @s OR TinhThanh LIKE @s OR SoDienThoai LIKE @s";
        sql += " ORDER BY MaChiNhanh";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%" });
    }

    public async Task<dynamic?> GetById(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>("SELECT * FROM ChiNhanh WHERE MaChiNhanh = @id", new { id });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO ChiNhanh (MaChiNhanh, TenChiNhanh, DiaChi, TinhThanh, SoDienThoai, Email, GioMoCua, GioDongCua) 
              VALUES (@MaChiNhanh, @TenChiNhanh, @DiaChi, @TinhThanh, @SoDienThoai, @Email, @GioMoCua, @GioDongCua)", param);
    }

    public async Task<int> Update(string id, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE ChiNhanh SET TenChiNhanh=@TenChiNhanh, DiaChi=@DiaChi, TinhThanh=@TinhThanh, 
              SoDienThoai=@SoDienThoai, Email=@Email, GioMoCua=@GioMoCua, GioDongCua=@GioDongCua, TrangThai=@TrangThai 
              WHERE MaChiNhanh=@id", param);
    }

    public async Task<int> Delete(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("DELETE FROM ChiNhanh WHERE MaChiNhanh = @id", new { id });
    }
}
