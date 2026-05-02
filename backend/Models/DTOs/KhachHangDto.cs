namespace backend.Models.DTOs;

public class KhachHangDto
{
    public string SoDienThoai { get; set; } = "";
    public string HoTen { get; set; } = "";
    public string? GioiTinh { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? Email { get; set; }
    public string? MatKhau { get; set; }
    public int? HangThanhVien { get; set; }
    public int? DiemTichLuy { get; set; }
    public int? TongDiemTich { get; set; }
    public bool? TrangThai { get; set; }
}
