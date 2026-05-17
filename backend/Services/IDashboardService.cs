namespace backend.Services;

public interface IDashboardService
{
    Task<DashboardStats> GetDashboardStats();
    Task<List<RevenueChartData>> GetRevenueChart(int months);
    Task<List<TopServiceData>> GetTopServices(int top);
    Task<List<RecentBookingData>> GetRecentBookings(int limit);
    Task<List<TopStaffData>> GetTopStaff(int top);
    Task<AverageRatingData> GetAverageRatings();
    Task<List<CustomerByTierData>> GetCustomersByTier();
    Task<List<RevenueByBranchData>> GetRevenueByBranch();
}

public class DashboardStats
{
    public int TongDonHang { get; set; }
    public int SoDichVu { get; set; }
    public int SoNhanVien { get; set; }
    public decimal DoanhThuThang { get; set; }
    public int SoKhachHang { get; set; }
    public int SoChiNhanh { get; set; }
    public int SanPhamCanhBao { get; set; }
}

public class RevenueChartData
{
    public string Thang { get; set; } = "";
    public decimal DoanhThu { get; set; }
    public int SoDon { get; set; }
}

public class TopServiceData
{
    public string MaDichVu { get; set; } = "";
    public string TenDichVu { get; set; } = "";
    public string? HinhAnh { get; set; }
    public int SoLuotDung { get; set; }
    public decimal TongDoanhThu { get; set; }
}

public class RecentBookingData
{
    public string MaDatLich { get; set; } = "";
    public string TenKhachHang { get; set; } = "";
    public string TenDichVu { get; set; } = "";
    public string TenNhanVien { get; set; } = "";
    public DateTime ThoiGianHen { get; set; }
    public string TrangThai { get; set; } = "";
}

public class TopStaffData
{
    public string MaNhanVien { get; set; } = "";
    public string HoTen { get; set; } = "";
    public string ChucVu { get; set; } = "";
    public int SoLuotPhucVu { get; set; }
    public decimal TongDoanhThu { get; set; }
}

public class AverageRatingData
{
    public double SaoDichVuTB { get; set; }
    public double SaoNhanVienTB { get; set; }
    public double SaoCuaHangTB { get; set; }
    public int TongDanhGia { get; set; }
}

public class CustomerByTierData
{
    public int HangThanhVien { get; set; }
    public string TenHang { get; set; } = "";
    public int SoLuong { get; set; }
}

public class RevenueByBranchData
{
    public string MaChiNhanh { get; set; } = "";
    public string TenChiNhanh { get; set; } = "";
    public decimal DoanhThu { get; set; }
    public int SoDon { get; set; }
}
