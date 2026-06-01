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
        // Kiểm tra email có hợp lệ không (chứa @)
        if (!email.Contains("@"))
        {
            return (false, null, "Vui lòng nhập địa chỉ email hợp lệ!");
        }

        // Đăng nhập dựa trên loại tài khoản
        if (accountType == "admin")
        {
            // Kiểm tra QuanLy
            var admin = await _repo.FindAdminByEmail(email, password);
            if (admin != null) return (true, admin, null);

            return (false, null, "Sai email hoặc mật khẩu! Hoặc tài khoản không phải là quản lý.");
        }
        else if (accountType == "staff")
        {
            // Kiểm tra Admin (QuanLy) trước
            var admin = await _repo.FindAdminByEmail(email, password);
            if (admin != null) return (true, admin, null);

            // Sau đó kiểm tra Staff (NhanVien)
            var staff = await _repo.FindStaffByEmail(email, password);
            if (staff != null) return (true, staff, null);

            return (false, null, "Sai email hoặc mật khẩu! Hoặc tài khoản không phải là nhân viên.");
        }
        else // accountType == "user"
        {
            // Kiểm tra Customer (KhachHang)
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

    public async Task<(bool success, string message)> ChangePassword(string identifier, string oldPassword, string newPassword, string accountType)
    {
        // Verify old password first
        if (accountType == "admin")
        {
            var admin = identifier.Contains("@") 
                ? await _repo.FindAdminByEmail(identifier, oldPassword)
                : await _repo.FindAdmin(identifier, oldPassword);
            
            if (admin == null) return (false, "Mật khẩu cũ không đúng!");
            
            await _repo.UpdatePassword(identifier, newPassword, "QuanLy");
            return (true, "Đổi mật khẩu thành công!");
        }
        else if (accountType == "staff")
        {
            // Try admin first
            var admin = identifier.Contains("@") 
                ? await _repo.FindAdminByEmail(identifier, oldPassword)
                : await _repo.FindAdmin(identifier, oldPassword);
            
            if (admin != null)
            {
                await _repo.UpdatePassword(identifier, newPassword, "QuanLy");
                return (true, "Đổi mật khẩu thành công!");
            }

            // Then try staff
            var staff = identifier.Contains("@") 
                ? await _repo.FindStaffByEmail(identifier, oldPassword)
                : await _repo.FindStaff(identifier, oldPassword);
            
            if (staff == null) return (false, "Mật khẩu cũ không đúng!");
            
            await _repo.UpdatePassword(identifier, newPassword, "NhanVien");
            return (true, "Đổi mật khẩu thành công!");
        }
        else // user
        {
            var user = identifier.Contains("@") 
                ? await _repo.FindUserByEmail(identifier, oldPassword)
                : await _repo.FindUser(identifier, oldPassword);
            
            if (user == null) return (false, "Mật khẩu cũ không đúng!");
            
            await _repo.UpdatePassword(identifier, newPassword, "KhachHang");
            return (true, "Đổi mật khẩu thành công!");
        }
    }
}
