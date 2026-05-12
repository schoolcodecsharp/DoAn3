namespace backend.Data;

public interface IAuthRepository
{
    Task<dynamic?> FindAdmin(string phone, string password);
    Task<dynamic?> FindStaff(string phone, string password);
    Task<dynamic?> FindUser(string phone, string password);
    Task<dynamic?> FindByPhone(string phone);
    Task<dynamic?> FindByEmail(string email);
    Task<dynamic?> FindByEmailAndPassword(string email, string password);
    Task<dynamic?> FindAdminByEmail(string email, string password);
    Task<dynamic?> FindStaffByEmail(string email, string password);
    Task<dynamic?> FindUserByEmail(string email, string password);
    Task<int> CreateCustomer(string soDienThoai, string hoTen, string gioiTinh, DateTime? ngaySinh, string? email, string matKhau);
    Task<int> CreateCustomerFromGoogle(string email, string hoTen);
}

