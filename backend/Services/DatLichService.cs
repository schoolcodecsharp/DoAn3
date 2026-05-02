using backend.Data;
using backend.Models.DTOs;

namespace backend.Services;

public class DatLichService : IDatLichService
{
    private readonly IDatLichRepository _repo;
    public DatLichService(IDatLichRepository repo) => _repo = repo;

    public Task<IEnumerable<dynamic>> GetAll(string? search, string? trangThai, string? chiNhanh, string? nhanVien, string? khachHang) =>
        _repo.GetAll(search, trangThai, chiNhanh, nhanVien, khachHang);

    public Task<dynamic?> GetById(string id) => _repo.GetById(id);

    public Task<int> Create(DatLichDto dto) =>
        _repo.Create(new { dto.MaDatLich, dto.SoDienThoai, dto.MaChiNhanh, dto.MaNhanVien, dto.ThoiGianHen, dto.ThoiGianKetThuc, NguonDatLich = dto.NguonDatLich ?? "Website", dto.GhiChu });

    public Task<int> Update(string id, DatLichDto dto) =>
        _repo.Update(id, new { id, dto.MaNhanVien, dto.ThoiGianHen, dto.ThoiGianKetThuc, TrangThai = dto.TrangThai ?? "ChoXacNhan", dto.GhiChu });

    public Task<int> UpdateStatus(string id, string trangThai) => _repo.UpdateStatus(id, trangThai);
    public Task<IEnumerable<dynamic>> GetChiTiet(string id) => _repo.GetChiTiet(id);
    public Task<int> AddChiTiet(string id, ChiTietDatLichDto dto) => _repo.AddChiTiet(id, dto.MaDichVu, dto.SoLuong ?? 1);
}
