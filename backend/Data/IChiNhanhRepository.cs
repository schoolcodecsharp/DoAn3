namespace backend.Data;

public interface IChiNhanhRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search);
    Task<dynamic?> GetById(string id);
    Task<int> Create(object param);
    Task<int> Update(string id, object param);
    Task<int> Delete(string id);
}
