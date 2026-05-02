using backend.Models.DTOs;

namespace backend.Services;

public interface IHoaDonService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? khachHang);
    Task<dynamic?> GetById(string id);
    Task<int> Create(HoaDonDto dto);
    Task<IEnumerable<dynamic>> GetChiTiet(string id);
}
