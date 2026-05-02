using backend.Models.DTOs;

namespace backend.Services;

public interface IKhuyenMaiService
{
    Task<IEnumerable<dynamic>> GetAll(string? search);
    Task<int> Create(KhuyenMaiDto dto);
    Task<int> Update(string code, KhuyenMaiDto dto);
    Task<int> Delete(string code);
}
