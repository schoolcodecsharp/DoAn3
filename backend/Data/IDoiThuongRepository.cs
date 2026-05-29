namespace backend.Data;

public interface IDoiThuongRepository
{
    Task<IEnumerable<dynamic>> GetBySoDienThoai(string soDienThoai);
    Task<dynamic?> GetById(string maDoiThuong);
    Task<int> Create(object param);
    Task<int> UpdateTrangThai(string maDoiThuong, string trangThai, DateTime? ngaySuDung = null);
}
