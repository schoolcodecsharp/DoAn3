namespace backend.Data;

public interface IDichVuRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? danhMuc);
    Task<dynamic?> GetById(string id);
    Task<int> Create(object param);
    Task<int> Update(string id, object param);
    Task<int> Delete(string id);
}
