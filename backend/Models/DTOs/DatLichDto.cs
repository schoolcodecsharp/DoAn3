namespace backend.Models.DTOs;

public class DatLichDto
{
    public string MaDatLich { get; set; } = "";
    public string SoDienThoai { get; set; } = "";
    public string MaChiNhanh { get; set; } = "";
    public string? MaNhanVien { get; set; }
    public DateTime ThoiGianHen { get; set; }
    public DateTime? ThoiGianKetThuc { get; set; }
    public string? TrangThai { get; set; }
    public string? NguonDatLich { get; set; }
    public string? GhiChu { get; set; }
}

public class StatusDto
{
    public string TrangThai { get; set; } = "";
}

public class ChiTietDatLichDto
{
    public string MaDichVu { get; set; } = "";
    public int? SoLuong { get; set; }
}
