using backend.Models.DTOs;

namespace backend.Services;

public interface IKhachHangService
{
    Task<IEnumerable<dynamic>> GetAll(string? search);
    Task<dynamic?> GetById(string sdt);
    Task<int> Create(KhachHangDto dto);
    Task<int> Update(string sdt, KhachHangDto dto);
    Task<int> Delete(string sdt);
}
