using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class DanhGiaService : IDanhGiaService
{
    private readonly IDanhGiaRepository _repo;
    public DanhGiaService(IDanhGiaRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? nhanVien) => _repo.GetAll(search, nhanVien);

    public Task<int> Create(DanhGiaDto dto) =>
        _repo.Create(new { dto.MaHoaDon, dto.SoDienThoai, dto.MaNhanVien, dto.SaoDichVu, dto.SaoNhanVien, dto.SaoCuaHang, dto.NhanXet });
}
