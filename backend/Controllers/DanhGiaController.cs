using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/danhgia")]
public class DanhGiaController : ControllerBase
{
    private readonly IDanhGiaService _service;
    public DanhGiaController(IDanhGiaService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] string? nhanVien = null)
    {
        var result = await _service.GetAll(search, nhanVien);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DanhGiaDto dto)
    {
        var result = await _service.Create(dto);
        if (result > 0) return Ok(new { success = true, message = "Đánh giá thành công" });
        return BadRequest(new { success = false, message = "Đánh giá thất bại" });
    }
}
