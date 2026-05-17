namespace backend.Data;

public interface INhanVienRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh);
    Task<dynamic?> GetById(string id);
    Task<int> Create(object param);
    Task<int> Update(string id, object param);
    Task<int> Delete(string id);
    Task<IEnumerable<dynamic>> GetServiceHistory(string maNhanVien);
    Task<dynamic> GetStaffStats(string maNhanVien);
}
