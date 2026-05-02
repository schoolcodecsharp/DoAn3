namespace backend.Models.DTOs;

public class HoaDonDto
{
    public string MaHoaDon { get; set; } = "";
    public string SoDienThoai { get; set; } = "";
    public string? MaDatLich { get; set; }
    public string MaChiNhanh { get; set; } = "";
    public string? MaCode { get; set; }
    public decimal TongTien { get; set; }
    public decimal? GiamGia { get; set; }
    public decimal ThanhTien { get; set; }
    public int? DiemDuocCong { get; set; }
    public int? DiemDaDung { get; set; }
    public string? PhuongThucTT { get; set; }
    public string? GhiChu { get; set; }
}
