namespace backend.Data;

public interface IKhuyenMaiRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search);
    Task<int> Create(object param);
    Task<int> Update(string code, object param);
    Task<int> Delete(string code);
}
