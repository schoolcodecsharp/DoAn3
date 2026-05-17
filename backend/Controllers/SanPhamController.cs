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
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] string? chiNhanh)
        => Ok(await _service.GetAll(search, chiNhanh));

    [HttpGet("{maSanPham}/{maChiNhanh}")]
    public async Task<IActionResult> GetById(string maSanPham, string maChiNhanh)
    {
        var result = await _service.GetById(maSanPham, maChiNhanh);
        return result == null ? NotFound(new { message = "Không tìm thấy sản phẩm" }) : Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] dynamic dto)
    {
        var data = (IDictionary<string, object>)dto;
        var result = await _service.Create(new {
            MaSanPham = data.ContainsKey("maSanPham") ? data["maSanPham"]?.ToString() : "",
            MaChiNhanh = data.ContainsKey("maChiNhanh") ? data["maChiNhanh"]?.ToString() : "",
            TenSanPham = data.ContainsKey("tenSanPham") ? data["tenSanPham"]?.ToString() : "",
            ThuongHieu = data.ContainsKey("thuongHieu") ? data["thuongHieu"]?.ToString() : "",
            DanhMuc = data.ContainsKey("danhMuc") ? data["danhMuc"]?.ToString() : "",
            GiaNhap = data.ContainsKey("giaNhap") ? Convert.ToDecimal(data["giaNhap"]) : 0m,
            GiaBan = data.ContainsKey("giaBan") ? Convert.ToDecimal(data["giaBan"]) : 0m,
            SoLuong = data.ContainsKey("soLuong") ? Convert.ToInt32(data["soLuong"]) : 0,
            SoLuongToiThieu = data.ContainsKey("soLuongToiThieu") ? Convert.ToInt32(data["soLuongToiThieu"]) : 5
        });
        if (result > 0) return Ok(new { success = true, message = "Thêm sản phẩm thành công" });
        return BadRequest(new { success = false, message = "Thêm sản phẩm thất bại" });
    }

    [HttpPut("{maSanPham}/{maChiNhanh}")]
    public async Task<IActionResult> Update(string maSanPham, string maChiNhanh, [FromBody] dynamic dto)
    {
        var data = (IDictionary<string, object>)dto;
        var result = await _service.Update(maSanPham, maChiNhanh, new {
            MaSanPham = maSanPham,
            MaChiNhanh = maChiNhanh,
            TenSanPham = data.ContainsKey("tenSanPham") ? data["tenSanPham"]?.ToString() : "",
            ThuongHieu = data.ContainsKey("thuongHieu") ? data["thuongHieu"]?.ToString() : "",
            DanhMuc = data.ContainsKey("danhMuc") ? data["danhMuc"]?.ToString() : "",
            GiaNhap = data.ContainsKey("giaNhap") ? Convert.ToDecimal(data["giaNhap"]) : 0m,
            GiaBan = data.ContainsKey("giaBan") ? Convert.ToDecimal(data["giaBan"]) : 0m,
            SoLuong = data.ContainsKey("soLuong") ? Convert.ToInt32(data["soLuong"]) : 0,
            SoLuongToiThieu = data.ContainsKey("soLuongToiThieu") ? Convert.ToInt32(data["soLuongToiThieu"]) : 5,
            TrangThai = data.ContainsKey("trangThai") ? Convert.ToBoolean(data["trangThai"]) : true
        });
        if (result > 0) return Ok(new { success = true, message = "Cập nhật sản phẩm thành công" });
        return BadRequest(new { success = false, message = "Cập nhật thất bại" });
    }

    [HttpDelete("{maSanPham}/{maChiNhanh}")]
    public async Task<IActionResult> Delete(string maSanPham, string maChiNhanh)
    {
        var result = await _service.Delete(maSanPham, maChiNhanh);
        if (result > 0) return Ok(new { success = true, message = "Xóa thành công" });
        return BadRequest(new { success = false, message = "Xóa thất bại" });
    }

    /// <summary>
    /// Lấy danh sách sản phẩm tồn kho thấp (cảnh báo)
    /// </summary>
    [HttpGet("canh-bao-ton-kho")]
    public async Task<IActionResult> GetLowStock([FromQuery] string? chiNhanh)
        => Ok(await _service.GetLowStock(chiNhanh));
}
