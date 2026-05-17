using backend.Data;
using Google.Apis.Auth;

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

        return (false, null, "Sai số điện thoại hoặc mật khẩu!");
    }

    public async Task<(bool success, object? user, string? message)> LoginWithEmail(string email, string password, string accountType)
    {
        // Check if email is valid (contains @)
        if (!email.Contains("@"))
        {
            return (false, null, "Vui lòng nhập địa chỉ email hợp lệ!");
        }

        // Login based on account type
        if (accountType == "admin")
        {
            // Check QuanLy
            var admin = await _repo.FindAdminByEmail(email, password);
            if (admin != null) return (true, admin, null);

            return (false, null, "Sai email hoặc mật khẩu! Hoặc tài khoản không phải là quản lý.");
        }
        else if (accountType == "staff")
        {
            // Check Admin (QuanLy) first
            var admin = await _repo.FindAdminByEmail(email, password);
            if (admin != null) return (true, admin, null);

            // Then check Staff (NhanVien)
            var staff = await _repo.FindStaffByEmail(email, password);
            if (staff != null) return (true, staff, null);

            return (false, null, "Sai email hoặc mật khẩu! Hoặc tài khoản không phải là nhân viên.");
        }
        else // accountType == "user"
        {
            // Check Customer (KhachHang)
            var user = await _repo.FindUserByEmail(email, password);
            if (user != null) return (true, user, null);

            return (false, null, "Sai email hoặc mật khẩu! Hoặc tài khoản không phải là khách hàng.");
        }
    }

    public async Task<(bool success, string message)> Register(string soDienThoai, string hoTen, string? gioiTinh, DateTime? ngaySinh, string? email, string matKhau)
    {
        var existing = await _repo.FindByPhone(soDienThoai);
        if (existing != null) return (false, "Số điện thoại đã được đăng ký!");

        await _repo.CreateCustomer(soDienThoai, hoTen, gioiTinh ?? "Nam", ngaySinh, email, matKhau);
        return (true, "Đăng ký thành công!");
    }

    public async Task<(bool success, object? user, string? message)> GoogleLogin(string idToken)
    {
        try
        {
            // Verify Google ID token
            var payload = await GoogleJsonWebSignature.ValidateAsync(idToken);
            var email = payload.Email;
            var hoTen = payload.Name ?? payload.Email;

            // Find existing user by email
            var existingUser = await _repo.FindByEmail(email);
            if (existingUser != null)
            {
                return (true, existingUser, null);
            }

            // Create new KhachHang from Google account
            await _repo.CreateCustomerFromGoogle(email, hoTen);
            
            // Fetch the newly created user
            var newUser = await _repo.FindByEmail(email);
            return (true, newUser, null);
        }
        catch (InvalidJwtException)
        {
            return (false, null, "Token Google không hợp lệ!");
        }
        catch (Exception ex)
        {
            return (false, null, $"Lỗi xác thực Google: {ex.Message}");
        }
    }
}
