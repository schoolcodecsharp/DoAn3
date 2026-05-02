using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class NhanVienService : INhanVienService
{
    private readonly INhanVienRepository _repo;
    public NhanVienService(INhanVienRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? chiNhanh) => _repo.GetAll(search, chiNhanh);
    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public Task<int> Create(NhanVienDto dto) =>
        _repo.Create(new { dto.MaNhanVien, dto.MaChiNhanh, dto.HoTen, GioiTinh = dto.GioiTinh ?? "Nam", dto.NgaySinh, dto.SoDienThoai, dto.Email, ChucVu = dto.ChucVu ?? "Stylist", LuongCoBan = dto.LuongCoBan ?? 0, MatKhau = dto.MatKhau ?? "123456" });

    public Task<int> Update(string id, NhanVienDto dto) =>
        _repo.Update(id, new { id, dto.MaChiNhanh, dto.HoTen, dto.GioiTinh, dto.NgaySinh, dto.SoDienThoai, dto.Email, dto.ChucVu, LuongCoBan = dto.LuongCoBan ?? 0, TrangThai = dto.TrangThai ?? true });

    public Task<int> Delete(string id) => _repo.Delete(id);
}
