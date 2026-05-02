namespace backend.Models.DTOs;

public class NhanVienDto
{
    public string MaNhanVien { get; set; } = "";
    public string MaChiNhanh { get; set; } = "";
    public string HoTen { get; set; } = "";
    public string? GioiTinh { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string SoDienThoai { get; set; } = "";
    public string? Email { get; set; }
    public string? ChucVu { get; set; }
    public decimal? LuongCoBan { get; set; }
    public string? MatKhau { get; set; }
    public bool? TrangThai { get; set; }
}
