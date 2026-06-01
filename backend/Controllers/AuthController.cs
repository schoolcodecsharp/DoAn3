using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _service;
    public AuthController(IAuthService service) => _service = service;

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        // Kiểm tra định dạng email (phải chứa @)
        if (string.IsNullOrEmpty(req.Email) || !req.Email.Contains("@"))
        {
            return BadRequest(new { success = false, message = "Vui lòng nhập địa chỉ email hợp lệ" });
        }

        // Kiểm tra loại tài khoản
        if (req.AccountType != "user" && req.AccountType != "staff" && req.AccountType != "admin")
        {
            return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });
        }

        var (success, user, message) = await _service.LoginWithEmail(req.Email, req.Password, req.AccountType);
        if (!success) return Unauthorized(new { success, message });
        return Ok(new { success, user });
    }

    /// <summary>
    /// Đăng nhập bằng SĐT + Mật khẩu (cho QuanLy hoặc NhanVien)
    /// </summary>
    [HttpPost("login-phone")]
    public async Task<IActionResult> LoginByPhone([FromBody] PhoneLoginRequest req)
    {
        if (string.IsNullOrEmpty(req.SoDienThoai) || string.IsNullOrEmpty(req.MatKhau))
        {
            return BadRequest(new { success = false, message = "Vui lòng nhập số điện thoại và mật khẩu" });
        }

        var (success, user, message) = await _service.Login(req.SoDienThoai, req.MatKhau);
        if (!success) return Unauthorized(new { success, message });
        return Ok(new { success, user });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        var (success, message) = await _service.Register(req.SoDienThoai, req.HoTen, req.GioiTinh, req.NgaySinh, req.Email, req.MatKhau);
        if (!success) return BadRequest(new { success, message });
        return Ok(new { success, message });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginRequest req)
    {
        var (success, user, message) = await _service.GoogleLogin(req.IdToken);
        if (!success) return Unauthorized(new { success, message });
        return Ok(new { success, user });
    }

    /// <summary>
    /// Đổi mật khẩu
    /// </summary>
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest req)
    {
        if (string.IsNullOrEmpty(req.Identifier) || string.IsNullOrEmpty(req.OldPassword) || string.IsNullOrEmpty(req.NewPassword))
        {
            return BadRequest(new { success = false, message = "Vui lòng nhập đầy đủ thông tin" });
        }

        if (req.NewPassword.Length < 6)
        {
            return BadRequest(new { success = false, message = "Mật khẩu mới phải có ít nhất 6 ký tự" });
        }

        var (success, message) = await _service.ChangePassword(req.Identifier, req.OldPassword, req.NewPassword, req.AccountType);
        if (!success) return BadRequest(new { success, message });
        return Ok(new { success, message });
    }
}
