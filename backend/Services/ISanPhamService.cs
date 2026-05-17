namespace backend.Services;

public interface ISanPhamService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh);
    Task<dynamic?> GetById(string maSanPham, string maChiNhanh);
    Task<int> Create(object param);
    Task<int> Update(string maSanPham, string maChiNhanh, object param);
    Task<int> Delete(string maSanPham, string maChiNhanh);
    Task<IEnumerable<dynamic>> GetLowStock(string? chiNhanh);
}
