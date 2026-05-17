using backend.Data;

namespace backend.Services;

public class SanPhamService : ISanPhamService
{
    private readonly ISanPhamRepository _repo;
    public SanPhamService(ISanPhamRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh) => _repo.GetAll(search, chiNhanh);
    public Task<dynamic?> GetById(string maSanPham, string maChiNhanh) => _repo.GetById(maSanPham, maChiNhanh);
    public Task<int> Create(object param) => _repo.Create(param);
    public Task<int> Update(string maSanPham, string maChiNhanh, object param) => _repo.Update(maSanPham, maChiNhanh, param);
    public Task<int> Delete(string maSanPham, string maChiNhanh) => _repo.Delete(maSanPham, maChiNhanh);
    public Task<IEnumerable<dynamic>> GetLowStock(string? chiNhanh) => _repo.GetLowStock(chiNhanh);
}
