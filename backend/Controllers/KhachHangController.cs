using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/khachhang")]
public class KhachHangController : ControllerBase
{
    private readonly IKhachHangService _service;
    public KhachHangController(IKhachHangService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search) => Ok(await _service.GetAll(search));

    [HttpGet("{sdt}")]
    public async Task<IActionResult> GetById(string sdt)
    {
        var item = await _service.GetById(sdt);
        return item == null ? NotFound(new { message = "Khong tim thay!" }) : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] KhachHangDto dto) { await _service.Create(dto); return Created("", new { message = "Them khach hang thanh cong!" }); }

    [HttpPut("{sdt}")]
    public async Task<IActionResult> Update(string sdt, [FromBody] KhachHangDto dto) { await _service.Update(sdt, dto); return Ok(new { message = "Cap nhat thanh cong!" }); }

    [HttpDelete("{sdt}")]
    public async Task<IActionResult> Delete(string sdt) { await _service.Delete(sdt); return Ok(new { message = "Xoa thanh cong!" }); }
}
