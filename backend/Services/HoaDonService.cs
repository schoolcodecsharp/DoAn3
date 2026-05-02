using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class HoaDonService : IHoaDonService
{
    private readonly IHoaDonRepository _repo;
    public HoaDonService(IHoaDonRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? khachHang) => _repo.GetAll(search, khachHang);
    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public Task<int> Create(HoaDonDto dto) =>
        _repo.Create(new { dto.MaHoaDon, dto.SoDienThoai, dto.MaDatLich, dto.MaChiNhanh, dto.MaCode, dto.TongTien, GiamGia = dto.GiamGia ?? 0, dto.ThanhTien, DiemDuocCong = dto.DiemDuocCong ?? 0, DiemDaDung = dto.DiemDaDung ?? 0, PhuongThucTT = dto.PhuongThucTT ?? "TienMat", dto.GhiChu });

    public Task<IEnumerable<dynamic>> GetChiTiet(string id) => _repo.GetChiTiet(id);
}
