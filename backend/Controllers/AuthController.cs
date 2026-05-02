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
        var (success, user, message) = await _service.Login(req.Phone, req.Password);
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
}
