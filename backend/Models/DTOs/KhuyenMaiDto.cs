namespace backend.Models.DTOs;

public class KhuyenMaiDto
{
    public string MaCode { get; set; } = "";
    public string TenKhuyenMai { get; set; } = "";
    public string? LoaiGiam { get; set; }
    public decimal GiaTriGiam { get; set; }
    public decimal? GiaTriToiDa { get; set; }
    public decimal? DonHangToiThieu { get; set; }
    public int? SoLanToiDa { get; set; }
    public DateTime NgayBatDau { get; set; }
    public DateTime NgayKetThuc { get; set; }
    public bool? TrangThai { get; set; }
}
