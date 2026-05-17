namespace backend.Data;

public interface IDanhGiaRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? nhanVien);
    Task<dynamic?> GetByHoaDon(string maHoaDon);
    Task<int> Create(object param);
}
