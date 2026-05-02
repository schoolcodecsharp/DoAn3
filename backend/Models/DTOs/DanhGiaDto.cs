namespace backend.Models.DTOs;

public class DanhGiaDto
{
    public string MaHoaDon { get; set; } = "";
    public string SoDienThoai { get; set; } = "";
    public string? MaNhanVien { get; set; }
    public int SaoDichVu { get; set; }
    public int SaoNhanVien { get; set; }
    public int SaoCuaHang { get; set; }
    public string? NhanXet { get; set; }
}
