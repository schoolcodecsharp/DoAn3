using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/chinhanh")]
public class ChiNhanhController : ControllerBase
{
    private readonly IChiNhanhService _service;
    public ChiNhanhController(IChiNhanhService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search) => Ok(await _service.GetAll(search));

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var item = await _service.GetById(id);
        return item == null ? NotFound(new { message = "Khong tim thay!" }) : Ok(item);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ChiNhanhDto dto) { await _service.Create(dto); return Created("", new { message = "Them chi nhanh thanh cong!" }); }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] ChiNhanhDto dto) { await _service.Update(id, dto); return Ok(new { message = "Cap nhat thanh cong!" }); }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id) { await _service.Delete(id); return Ok(new { message = "Xoa thanh cong!" }); }
}
