using backend.Models.DTOs;

namespace backend.Services;

public interface INhanVienService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh);
    Task<dynamic?> GetById(string id);
    Task<int> Create(NhanVienDto dto);
    Task<int> Update(string id, NhanVienDto dto);
    Task<int> Delete(string id);
}
