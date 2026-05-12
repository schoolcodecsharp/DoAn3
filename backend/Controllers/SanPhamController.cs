using Microsoft.AspNetCore.Mvc;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/sanpham")]
public class SanPhamController : ControllerBase
{
    private readonly ISanPhamService _service;
    public SanPhamController(ISanPhamService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search = null, [FromQuery] string? chiNhanh = null)
    {
        var result = await _service.GetAll(search, chiNhanh);
        return Ok(result);
    }
}
