using backend.Data;

namespace backend.Services;

public class SanPhamService : ISanPhamService
{
    private readonly ISanPhamRepository _repo;
    public SanPhamService(ISanPhamRepository repo) => _repo = repo;
    public Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh) => _repo.GetAll(search, chiNhanh);
}
