namespace backend.Models.DTOs;

public class ChiNhanhDto
{
    public string MaChiNhanh { get; set; } = "";
    public string TenChiNhanh { get; set; } = "";
    public string DiaChi { get; set; } = "";
    public string TinhThanh { get; set; } = "";
    public string? SoDienThoai { get; set; }
    public string? Email { get; set; }
    public string? GioMoCua { get; set; }
    public string? GioDongCua { get; set; }
    public bool? TrangThai { get; set; }
}
