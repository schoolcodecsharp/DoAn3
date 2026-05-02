namespace backend.Data;

public interface IHoaDonRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? khachHang);
    Task<dynamic?> GetById(string id);
    Task<int> Create(object param);
    Task<IEnumerable<dynamic>> GetChiTiet(string id);
}
