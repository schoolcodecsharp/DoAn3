using backend.Models.DTOs;

namespace backend.Services;

public interface IChiNhanhService
{
    Task<IEnumerable<dynamic>> GetAll(string? search);
    Task<dynamic?> GetById(string id);
    Task<int> Create(ChiNhanhDto dto);
    Task<int> Update(string id, ChiNhanhDto dto);
    Task<int> Delete(string id);
}
