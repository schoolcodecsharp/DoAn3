using backend.Models.DTOs;

namespace backend.Services;

public interface IDatLichService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? trangThai, string? chiNhanh, string? nhanVien, string? khachHang);
    Task<dynamic?> GetById(string id);
    Task<int> Create(DatLichDto dto);
    Task<int> Update(string id, DatLichDto dto);
    Task<int> UpdateStatus(string id, string trangThai);
    Task<IEnumerable<dynamic>> GetChiTiet(string id);
    Task<int> AddChiTiet(string id, ChiTietDatLichDto dto);
}
