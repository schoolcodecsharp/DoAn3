using backend.Models.DTOs;

namespace backend.Services;

public interface IDanhGiaService
{
    Task<IEnumerable<dynamic>> GetAll(string? search, string? nhanVien);
    Task<int> Create(DanhGiaDto dto);
}
