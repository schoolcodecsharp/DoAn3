namespace backend.Models.DTOs;

public class DoiThuongDto
{
    public string MaDoiThuong { get; set; } = "";
    public string SoDienThoai { get; set; } = "";
    public int DiemDaDoi { get; set; }
    public string MaCode { get; set; } = "";
    public string? TrangThai { get; set; }
    public DateTime NgayDoiThuong { get; set; }
    public DateTime NgayHetHan { get; set; }
    public DateTime? NgaySuDung { get; set; }
    
    // Thông tin bổ sung từ join
    public string? TenKhuyenMai { get; set; }
    public decimal? GiaTriGiam { get; set; }
    public string? LoaiGiam { get; set; }
}

public class DoiThuongRequest
{
    public string SoDienThoai { get; set; } = "";
    public int DiemDoi { get; set; }  // Số điểm muốn đổi (VD: 100 điểm)
    public string LoaiDoiThuong { get; set; } = "giam20"; // giam10, giam20, goiDau, catToc, comboVIP, voucher100k
}

public class DoiThuongResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = "";
    public string? MaCode { get; set; }
    public string? MaDoiThuong { get; set; }
    public DateTime? NgayHetHan { get; set; }
    public int? DiemConLai { get; set; }
    public decimal? GiaTriGiam { get; set; }
    public string? LoaiGiam { get; set; }
    public string? TenKhuyenMai { get; set; }
}
