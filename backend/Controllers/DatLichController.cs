using Microsoft.AspNetCore.Mvc;
using backend.Models.DTOs;
using backend.Services;

namespace backend.Controllers;

[ApiController]
[Route("api/datlich")]
public class DatLichController : ControllerBase
{
    private readonly IDatLichService _service;
    public DatLichController(IDatLichService service) => _service = service;

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] string? trangThai = null,
        [FromQuery] string? chiNhanh = null,
        [FromQuery] string? nhanVien = null,
        [FromQuery] string? khachHang = null)
    {
        var result = await _service.GetAll(search, trangThai, chiNhanh, nhanVien, khachHang);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var result = await _service.GetById(id);
        if (result == null) return NotFound(new { message = "Không tìm thấy lịch hẹn" });
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] DatLichDto dto)
    {
        var result = await _service.Create(dto);
        if (result > 0) return Ok(new { success = true, message = "Đặt lịch thành công" });
        return BadRequest(new { success = false, message = "Đặt lịch thất bại" });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] DatLichDto dto)
    {
        var result = await _service.Update(id, dto);
        if (result > 0) return Ok(new { success = true, message = "Cập nhật thành công" });
        return BadRequest(new { success = false, message = "Cập nhật thất bại" });
    }

    [HttpPatch("{id}/trangthai")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] StatusDto dto)
    {
        var result = await _service.UpdateStatus(id, dto.TrangThai);
        if (result > 0) return Ok(new { success = true, message = "Cập nhật trạng thái thành công" });
        return BadRequest(new { success = false, message = "Cập nhật trạng thái thất bại" });
    }

    [HttpGet("{id}/chitiet")]
    public async Task<IActionResult> GetChiTiet(string id)
    {
        var result = await _service.GetChiTiet(id);
        return Ok(result);
    }

    [HttpPost("{id}/chitiet")]
    public async Task<IActionResult> AddChiTiet(string id, [FromBody] ChiTietDatLichDto dto)
    {
        var result = await _service.AddChiTiet(id, dto);
        if (result > 0) return Ok(new { success = true, message = "Thêm chi tiết thành công" });
        return BadRequest(new { success = false, message = "Thêm chi tiết thất bại" });
    }
}
