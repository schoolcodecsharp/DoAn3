using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class KhachHangService : IKhachHangService
{
    private readonly IKhachHangRepository _repo;
    public KhachHangService(IKhachHangRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search) => _repo.GetAll(search);
    public Task<dynamic?> GetById(string sdt) => _repo.GetById(sdt);

    public Task<int> Create(KhachHangDto dto) =>
        _repo.Create(new { dto.SoDienThoai, dto.HoTen, GioiTinh = dto.GioiTinh ?? "Nam", dto.NgaySinh, dto.Email, MatKhau = dto.MatKhau ?? "123456" });

    public Task<int> Update(string sdt, KhachHangDto dto) =>
        _repo.Update(sdt, new { sdt, dto.HoTen, dto.GioiTinh, dto.NgaySinh, dto.Email, HangThanhVien = dto.HangThanhVien ?? 0, DiemTichLuy = dto.DiemTichLuy ?? 0, TongDiemTich = dto.TongDiemTich ?? 0, TrangThai = dto.TrangThai ?? true });

    public Task<int> Delete(string sdt) => _repo.Delete(sdt);
}
