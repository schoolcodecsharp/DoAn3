using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/hoadon")]
public class HoaDonController : ControllerBase
{
    private readonly IHoaDonService _service;
    public HoaDonController(IHoaDonService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] string? khachHang = null)
    {
        var result = await _service.GetAll(search, khachHang);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _service.GetById(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy hóa đơn" });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] HoaDonDto dto)
    {
        var result = await _service.Create(dto);
        if (result > 0) return Ok(new { success = true, message = "Tạo hóa đơn thành công" });
        return BadRequest(new { success = false, message = "Tạo hóa đơn thất bại" });
    }

    [HttpGet("{id}/chitiet")]
    public async Task<IActionResult> GetChiTiet(string id)
    {
        var result = await _service.GetChiTiet(id);
        return Ok(result);
    }
}
