namespace backend.Data;

public interface IDanhGiaRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? nhanVien);
    Task<int> Create(object param);
}
