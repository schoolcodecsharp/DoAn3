using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/khuyenmai")]
public class KhuyenMaiController : ControllerBase
{
    private readonly IKhuyenMaiService _service;
    
    public KhuyenMaiController(IKhuyenMaiService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null)
    {
        var result = await _service.GetAll(search);
        return Ok(new { success = true, data = result });
    }

    [HttpGet("{code}")]
    public async Task<IActionResult> GetByCode(string code)
    {
        var all = await _service.GetAll(code);
        var item = all.FirstOrDefault();
        if (item == null) return NotFound(new { success = false, message = "Không tìm thấy khuyến mãi" });
        return Ok(new { success = true, data = item });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] KhuyenMaiDto dto)
    {
        var result = await _service.Create(dto);
        if (result > 0)
            return Ok(new { success = true, message = "Thêm khuyến mãi thành công" });
        return BadRequest(new { success = false, message = "Thêm khuyến mãi thất bại" });
    }

    [HttpPut("{code}")]
    public async Task<IActionResult> Update(string code, [FromBody] KhuyenMaiDto dto)
    {
        var result = await _service.Update(code, dto);
        if (result > 0)
            return Ok(new { success = true, message = "Cập nhật khuyến mãi thành công" });
        return BadRequest(new { success = false, message = "Cập nhật khuyến mãi thất bại" });
    }

    [HttpDelete("{code}")]
    public async Task<IActionResult> Delete(string code)
    {
        var result = await _service.Delete(code);
        if (result > 0)
            return Ok(new { success = true, message = "Xóa khuyến mãi thành công" });
        return BadRequest(new { success = false, message = "Xóa khuyến mãi thất bại" });
    }
}
