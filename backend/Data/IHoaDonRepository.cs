namespace backend.Data;

public interface IHoaDonRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? khachHang);
    Task<dynamic?> GetById(string id);
    Task<int> Create(object param);
    Task<int> UpdatePayment(string id, string? maCode, decimal giamGia, decimal thanhTien, string phuongThucTT, string? ghiChu);
    Task<int> CreateChiTiet(string maHoaDon, string maDichVu, string? maNhanVien, int soLuong, decimal donGia, decimal thanhTien);
    Task<IEnumerable<dynamic>> GetChiTiet(string id);
}
