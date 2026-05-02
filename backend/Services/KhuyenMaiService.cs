using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class KhuyenMaiService : IKhuyenMaiService
{
    private readonly IKhuyenMaiRepository _repo;
    public KhuyenMaiService(IKhuyenMaiRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search) => _repo.GetAll(search);

    public Task<int> Create(KhuyenMaiDto dto) =>
        _repo.Create(new { dto.MaCode, dto.TenKhuyenMai, LoaiGiam = dto.LoaiGiam ?? "PhanTram", dto.GiaTriGiam, dto.GiaTriToiDa, DonHangToiThieu = dto.DonHangToiThieu ?? 0, SoLanToiDa = dto.SoLanToiDa ?? 100, dto.NgayBatDau, dto.NgayKetThuc });

    public Task<int> Update(string code, KhuyenMaiDto dto) =>
        _repo.Update(code, new { code, dto.TenKhuyenMai, dto.LoaiGiam, dto.GiaTriGiam, dto.GiaTriToiDa, DonHangToiThieu = dto.DonHangToiThieu ?? 0, SoLanToiDa = dto.SoLanToiDa ?? 100, dto.NgayBatDau, dto.NgayKetThuc, TrangThai = dto.TrangThai ?? true });

    public Task<int> Delete(string code) => _repo.Delete(code);
}
