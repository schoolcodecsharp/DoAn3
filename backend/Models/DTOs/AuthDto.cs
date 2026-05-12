namespace backend.Models.DTOs;

public class LoginRequest
{
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string AccountType { get; set; } = "user"; // "user" hoặc "staff"
}

public class RegisterRequest
{
    public string SoDienThoai { get; set; } = "";
    public string HoTen { get; set; } = "";
    public string? GioiTinh { get; set; }
    public DateTime? NgaySinh { get; set; }
    public string? Email { get; set; }
    public string MatKhau { get; set; } = "";
}

public class GoogleLoginRequest
{
    public string IdToken { get; set; } = "";
}

