using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/nhanvien")]
public class NhanVienController : ControllerBase
{
    private readonly INhanVienService _service;
    public NhanVienController(INhanVienService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? chiNhanh) => Ok(await _service.GetAll(search, chiNhanh));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var item = await _service.GetById(id);
        return item == null ? NotFound(new { message = "Khong tim thay!" }) : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] NhanVienDto dto) { await _service.Create(dto); return Created("", new { message = "Them nhan vien thanh cong!" }); }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] NhanVienDto dto) { await _service.Update(id, dto); return Ok(new { message = "Cap nhat thanh cong!" }); }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) { await _service.Delete(id); return Ok(new { message = "Xoa thanh cong!" }); }
}
