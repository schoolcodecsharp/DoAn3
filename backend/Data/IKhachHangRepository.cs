namespace backend.Data;

public interface IKhachHangRepository
{
    Task<IEnumerable<dynamic>> GetAll(string? search);
    Task<dynamic?> GetById(string sdt);
    Task<int> Create(object param);
    Task<int> Update(string sdt, object param);
    Task<int> Delete(string sdt);
    Task<int> UpdatePoints(string sdt, int diemCong, int diemDung);
    Task<int> UpdateMembership(string sdt);
}
