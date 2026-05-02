using backend.Data;

namespace backend.Services;

public class AuthService : IAuthService
{
    private readonly IAuthRepository _repo;
    public AuthService(IAuthRepository repo) => _repo = repo;

    public async Task<(bool success, object? user, string? message)> Login(string phone, string password)
    {
        var admin = await _repo.FindAdmin(phone, password);
        if (admin != null) return (true, admin, null);

        var staff = await _repo.FindStaff(phone, password);
        if (staff != null) return (true, staff, null);

        var user = await _repo.FindUser(phone, password);
        if (user != null) return (true, user, null);

        return (false, null, "Sai so dien thoai hoac mat khau!");
    }

    public async Task<(bool success, string message)> Register(string soDienThoai, string hoTen, string? gioiTinh, DateTime? ngaySinh, string? email, string matKhau)
    {
        var existing = await _repo.FindByPhone(soDienThoai);
        if (existing != null) return (false, "So dien thoai da duoc dang ky!");

        await _repo.CreateCustomer(soDienThoai, hoTen, gioiTinh ?? "Nam", ngaySinh, email, matKhau);
        return (true, "Dang ky thanh cong!");
    }
}
