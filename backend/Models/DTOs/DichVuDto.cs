namespace backend.Models.DTOs;

public class DichVuDto
{
    public string MaDichVu { get; set; } = "";
    public string TenDichVu { get; set; } = "";
    public string DanhMuc { get; set; } = "";
    public string? MoTa { get; set; }
    public decimal Gia { get; set; }
    public decimal? GiaSauGiam { get; set; }
    public int? ThoiGianPhut { get; set; }
    public int? DiemThuong { get; set; }
    public bool? TrangThai { get; set; }
}
