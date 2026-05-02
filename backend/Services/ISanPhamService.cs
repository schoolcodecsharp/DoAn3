namespace backend.Services;

public interface ISanPhamService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh);
}
