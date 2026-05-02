namespace backend.Data;

public interface IDatLichRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? trangThai, string? chiNhanh, string? nhanVien, string? khachHang);
    Task<dynamic?> GetById(string id);
    Task<int> Create(object param);
    Task<int> Update(string id, object param);
    Task<int> UpdateStatus(string id, string trangThai);
    Task<IEnumerable<dynamic>> GetChiTiet(string id);
    Task<int> AddChiTiet(string maDatLich, string maDichVu, int soLuong);
}
