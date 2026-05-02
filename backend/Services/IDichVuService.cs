using backend.Models.DTOs;

namespace backend.Services;

public interface IDichVuService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? danhMuc);
    Task<dynamic?> GetById(string id);
    Task<int> Create(DichVuDto dto);
    Task<int> Update(string id, DichVuDto dto);
    Task<int> Delete(string id);
}
