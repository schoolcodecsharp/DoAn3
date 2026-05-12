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
        // Validate email format (must contain @)
        if (string.IsNullOrEmpty(req.Email) || !req.Email.Contains("@"))
        {
            return BadRequest(new { success = false, message = "Vui lòng nhập địa chỉ email hợp lệ" });
        }

        // Validate account type
        if (req.AccountType != "user" && req.AccountType != "staff")
        {
            return BadRequest(new { success = false, message = "Loại tài khoản không hợp lệ" });
        }

        var (success, user, message) = await _service.LoginWithEmail(req.Email, req.Password, req.AccountType);
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
}
