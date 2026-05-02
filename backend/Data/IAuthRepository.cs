namespace backend.Data;

public interface IAuthRepository
{
    Task<dynamic?> FindAdmin(string phone, string password);
    Task<dynamic?> FindStaff(string phone, string password);
    Task<dynamic?> FindUser(string phone, string password);
    Task<dynamic?> FindByPhone(string phone);
    Task<int> CreateCustomer(string soDienThoai, string hoTen, string gioiTinh, DateTime? ngaySinh, string? email, string matKhau);
}
