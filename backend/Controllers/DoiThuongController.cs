using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/doithuong")]
public class DoiThuongController : ControllerBase
{
    private readonly IDoiThuongService _service;
    public DoiThuongController(IDoiThuongService service) => _service = service;

    /// <summary>
    /// Lấy lịch sử đổi thưởng của khách hàng
    /// </summary>
    [HttpGet("{soDienThoai}")]
    public async Task<IActionResult> GetLichSu(string soDienThoai)
    {
        var result = await _service.GetLichSu(soDienThoai);
        return Ok(result);
    }

    /// <summary>
    /// Đổi điểm lấy mã giảm giá
    /// </summary>
    [HttpPost("doi-diem")]
    public async Task<IActionResult> DoiDiem([FromBody] DoiThuongRequest request)
    {
        var result = await _service.DoiDiem(request);
        if (!result.Success)
        {
            return BadRequest(result);
        }
        return Ok(result);
    }
}
