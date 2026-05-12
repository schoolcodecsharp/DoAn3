using Microsoft.Data.SqlClient;
using Dapper;

namespace backend.Services;

public class DashboardService : IDashboardService
{
    private readonly string _connectionString;

    public DashboardService(IConfiguration config)
    {
        _connectionString = config.GetConnectionString("DefaultConnection") ?? "";
    }

    public async Task<DashboardStats> GetDashboardStats()
    {
        using var conn = new SqlConnection(_connectionString);
        
        var sql = @"
            SELECT 
                (SELECT COUNT(*) FROM DatLich WHERE TrangThai != 'DaHuy') as TongDonHang,
                (SELECT COUNT(*) FROM DichVu WHERE TrangThai = 1) as SoDichVu,
                (SELECT COUNT(*) FROM NhanVien WHERE TrangThai = 1) as SoNhanVien,
                (SELECT ISNULL(SUM(ThanhTien), 0) FROM HoaDon 
                 WHERE MONTH(ThoiGianTT) = MONTH(GETDATE()) 
                 AND YEAR(ThoiGianTT) = YEAR(GETDATE())) as DoanhThuThang,
                (SELECT COUNT(*) FROM KhachHang) as SoKhachHang,
                (SELECT COUNT(*) FROM ChiNhanh WHERE TrangThai = 1) as SoChiNhanh";

        return await conn.QueryFirstOrDefaultAsync<DashboardStats>(sql) ?? new DashboardStats();
    }

    public async Task<List<RevenueChartData>> GetRevenueChart(int months)
    {
        using var conn = new SqlConnection(_connectionString);
        
        var sql = @"
            SELECT 
                FORMAT(ThoiGianTT, 'MM/yyyy') as Thang,
                SUM(ThanhTien) as DoanhThu,
                COUNT(*) as SoDon
            FROM HoaDon
            WHERE ThoiGianTT >= DATEADD(MONTH, -@Months, GETDATE())
            GROUP BY FORMAT(ThoiGianTT, 'MM/yyyy'), YEAR(ThoiGianTT), MONTH(ThoiGianTT)
            ORDER BY YEAR(ThoiGianTT), MONTH(ThoiGianTT)";

        var result = await conn.QueryAsync<RevenueChartData>(sql, new { Months = months });
        return result.ToList();
    }

    public async Task<List<TopServiceData>> GetTopServices(int top)
    {
        using var conn = new SqlConnection(_connectionString);
        
        var sql = @"
            SELECT TOP (@Top)
                dv.MaDichVu,
                dv.TenDichVu,
                dv.HinhAnh,
                COUNT(ctdl.MaDichVu) as SoLuotDung,
                SUM(dv.Gia) as TongDoanhThu
            FROM DichVu dv
            LEFT JOIN ChiTietDatLich ctdl ON dv.MaDichVu = ctdl.MaDichVu
            WHERE dv.TrangThai = 1
            GROUP BY dv.MaDichVu, dv.TenDichVu, dv.HinhAnh
            ORDER BY SoLuotDung DESC";

        var result = await conn.QueryAsync<TopServiceData>(sql, new { Top = top });
        return result.ToList();
    }

    public async Task<List<RecentBookingData>> GetRecentBookings(int limit)
    {
        using var conn = new SqlConnection(_connectionString);
        
        var sql = @"
            SELECT TOP (@Limit)
                dl.MaDatLich,
                kh.HoTen as TenKhachHang,
                STRING_AGG(dv.TenDichVu, ', ') as TenDichVu,
                nv.HoTen as TenNhanVien,
                dl.ThoiGianHen,
                dl.TrangThai
            FROM DatLich dl
            LEFT JOIN KhachHang kh ON dl.SoDienThoai = kh.SoDienThoai
            LEFT JOIN NhanVien nv ON dl.MaNhanVien = nv.MaNhanVien
            LEFT JOIN ChiTietDatLich ctdl ON dl.MaDatLich = ctdl.MaDatLich
            LEFT JOIN DichVu dv ON ctdl.MaDichVu = dv.MaDichVu
            GROUP BY dl.MaDatLich, kh.HoTen, nv.HoTen, dl.ThoiGianHen, dl.TrangThai
            ORDER BY dl.ThoiGianHen DESC";

        var result = await conn.QueryAsync<RecentBookingData>(sql, new { Limit = limit });
        return result.ToList();
    }
}
