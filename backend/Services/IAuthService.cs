namespace backend.Services;

public interface IAuthService
{
    Task<(bool success, object? user, string? message)> Login(string phone, string password);
    Task<(bool success, object? user, string? message)> LoginWithEmail(string email, string password, string accountType);
    Task<(bool success, string message)> Register(string soDienThoai, string hoTen, string? gioiTinh, DateTime? ngaySinh, string? email, string matKhau);
    Task<(bool success, object? user, string? message)> GoogleLogin(string idToken);
}

