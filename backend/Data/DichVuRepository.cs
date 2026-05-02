using Dapper;
using Microsoft.Data.SqlClient;

namespace backend.Data;

public class DichVuRepository : IDichVuRepository
{
    private readonly string _conn;
    public DichVuRepository(IConfiguration config) => _conn = config.GetConnectionString("DefaultConnection")!;

    public async Task<IEnumerable<dynamic>> GetAll(string? search, string? danhMuc)
    {
        using var db = new SqlConnection(_conn);
        var sql = "SELECT * FROM DichVu";
        var conds = new List<string>();
        if (!string.IsNullOrEmpty(search)) conds.Add("(TenDichVu LIKE @s OR MaDichVu LIKE @s OR DanhMuc LIKE @s)");
        if (!string.IsNullOrEmpty(danhMuc)) conds.Add("DanhMuc = @danhMuc");
        if (conds.Count > 0) sql += " WHERE " + string.Join(" AND ", conds);
        sql += " ORDER BY MaDichVu";
        return await db.QueryAsync<dynamic>(sql, new { s = $"%{search}%", danhMuc });
    }

    public async Task<dynamic?> GetById(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.QueryFirstOrDefaultAsync<dynamic>("SELECT * FROM DichVu WHERE MaDichVu = @id", new { id });
    }

    public async Task<int> Create(object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"INSERT INTO DichVu (MaDichVu,TenDichVu,DanhMuc,MoTa,Gia,GiaSauGiam,ThoiGianPhut,DiemThuong) 
              VALUES (@MaDichVu,@TenDichVu,@DanhMuc,@MoTa,@Gia,@GiaSauGiam,@ThoiGianPhut,@DiemThuong)", param);
    }

    public async Task<int> Update(string id, object param)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync(
            @"UPDATE DichVu SET TenDichVu=@TenDichVu,DanhMuc=@DanhMuc,MoTa=@MoTa,Gia=@Gia,GiaSauGiam=@GiaSauGiam,
              ThoiGianPhut=@ThoiGianPhut,DiemThuong=@DiemThuong,TrangThai=@TrangThai WHERE MaDichVu=@id", param);
    }

    public async Task<int> Delete(string id)
    {
        using var db = new SqlConnection(_conn);
        return await db.ExecuteAsync("DELETE FROM DichVu WHERE MaDichVu = @id", new { id });
    }
}
