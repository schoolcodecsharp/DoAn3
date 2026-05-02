namespace backend.Data;

public interface ISanPhamRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh);
}
